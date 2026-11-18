import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan, Camera, Flashlight, AlertCircle, CheckCircle2,
  RefreshCw, Search, ArrowRight, ShoppingBag, Sparkles,
  UploadCloud, SwitchCamera, HelpCircle, FileImage
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { barcodeAPI, productsAPI } from '../services/api';
import ProductDetectionModal from '../components/scanner/ProductDetectionModal';
import BarcodeVisual from '../components/common/BarcodeVisual';
import StatusBadge from '../components/common/StatusBadge';
import { useCart } from '../context/CartContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { Link, useSearchParams } from 'react-router-dom';

export const BarcodeScannerPage = () => {
  const [searchParams] = useSearchParams();
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [detectedProduct, setDetectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [recentlyScanned, setRecentlyScanned] = useState([]);
  const [torchOn, setTorchOn] = useState(false);
  const [liveCatalogProducts, setLiveCatalogProducts] = useState([]);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);

  const html5QrCodeRef = useRef(null);
  const isProcessingRef = useRef(false);
  const fileInputRef = useRef(null);

  const { itemCount, total } = useCart();
  const { t } = useThemeLanguage();

  const fallbackBarcodes = [
    { name: "Amul Gold Milk 1L", barcode: "8901262010115", price: 68, category: "Dairy & Eggs", status: "in_stock" },
    { name: "Alphonso Mangoes 1kg", barcode: "8901030383701", price: 499, category: "Fruits & Vegetables", status: "in_stock" },
    { name: "Haldiram's Bhujia 400g", barcode: "8904004400101", price: 115, category: "Snacks", status: "in_stock" },
    { name: "Aashirvaad Atta 5kg", barcode: "8901725181222", price: 265, category: "Groceries", status: "in_stock" },
    { name: "Red Onions 2kg", barcode: "8901030383703", price: 70, category: "Fruits & Vegetables", status: "low_stock" },
    { name: "Fortune Sunflower Oil", barcode: "8900000000050", price: 155, category: "Household", status: "low_stock" },
  ];

  // Fetch live products from MongoDB on load
  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        const res = await productsAPI.getAll({ sort: 'newest' });
        if (res.data && res.data.length > 0) {
          setLiveCatalogProducts(res.data);
        }
      } catch (err) {
        console.error("Could not fetch live products for scanner simulator:", err);
      }
    };
    fetchLiveProducts();
  }, []);

  // Handle auto-scan if barcode query param is present
  useEffect(() => {
    const autoBarcode = searchParams.get('barcode');
    if (autoBarcode) {
      setManualBarcode(autoBarcode);
      handleBarcodeScanned(autoBarcode);
    }
  }, [searchParams]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn("Stop camera note:", e);
      }
      setCameraActive(false);
      setScanning(false);
    }
  };

  const startCamera = async (targetCameraId = null) => {
    setCameraError(null);
    setScanError(null);

    // Stop and clear previous scanner if active
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (_) {}
    }

    // Check mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera is not supported on this browser or connection. Please use Chrome, Edge, Safari, or Firefox over http://localhost:3454.");
      return;
    }

    let devices = [];
    try {
      // Step A: Pre-request permission so device labels and IDs are unlocked in Chromium
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
      tempStream.getTracks().forEach(track => track.stop());

      // Step B: Query enumerated cameras
      devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setAvailableCameras(devices);
      }
    } catch (permErr) {
      console.warn("Permission pre-check note:", permErr);
      if (permErr.name === "NotAllowedError" || permErr.name === "PermissionDeniedError") {
        setCameraError("Camera permission was denied. Please click the lock or camera icon in your browser URL bar to allow camera access, then click Activate Camera.");
        return;
      }
    }

    // Step C: Determine device ID
    let selectedId = targetCameraId || selectedCameraId;
    if (!selectedId && devices.length > 0) {
      const rearCam = devices.find(c =>
        c.label && (
          c.label.toLowerCase().includes('back') ||
          c.label.toLowerCase().includes('rear') ||
          c.label.toLowerCase().includes('environment')
        )
      );
      selectedId = rearCam ? rearCam.id : devices[0].id;
      setSelectedCameraId(selectedId);
    }

    try {
      const scanner = new Html5Qrcode("reader", { verbose: false });
      html5QrCodeRef.current = scanner;

      const qrCodeSuccessCallback = (decodedText) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        handleBarcodeScanned(decodedText);
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 2200);
      };

      const cameraConstraint = selectedId ? selectedId : { facingMode: "user" };

      await scanner.start(
        cameraConstraint,
        {
          fps: 15,
          qrbox: (w, h) => {
            const minEdge = Math.min(w, h);
            return {
              width: Math.max(220, Math.floor(minEdge * 0.82)),
              height: Math.max(150, Math.floor(minEdge * 0.58)),
            };
          }
        },
        qrCodeSuccessCallback,
        () => {} // suppress minor noise
      );

      setCameraActive(true);
      setScanning(true);
    } catch (err) {
      console.warn("Primary camera start failed, trying facingMode fallback:", err);

      try {
        if (html5QrCodeRef.current) {
          try {
            if (html5QrCodeRef.current.isScanning) await html5QrCodeRef.current.stop();
            await html5QrCodeRef.current.clear();
          } catch (_) {}
        }
        const fallbackScanner = new Html5Qrcode("reader", { verbose: false });
        html5QrCodeRef.current = fallbackScanner;

        await fallbackScanner.start(
          { facingMode: "user" },
          { fps: 15 },
          (decodedText) => handleBarcodeScanned(decodedText),
          () => {}
        );
        setCameraActive(true);
        setScanning(true);
        return;
      } catch (fallbackErr) {
        console.error("Camera fallback also failed:", fallbackErr);
      }

      const isPermissionDenied = err.name === "NotAllowedError" || err.message?.includes("Permission");
      const errorMsg = isPermissionDenied
        ? "Camera permission was denied. Please allow camera permissions in your browser URL bar (click the camera icon)."
        : `Camera could not be accessed (${err.message || 'Device in use'}). You can use the Live Supermarket Barcode Simulator below, upload a barcode photo, or enter the barcode number manually.`;

      setCameraError(errorMsg);
      setCameraActive(false);
      setScanning(false);
    }
  };

  const switchCamera = async () => {
    if (availableCameras.length <= 1) return;
    const currentIndex = availableCameras.findIndex(c => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextCamera = availableCameras[nextIndex];
    setSelectedCameraId(nextCamera.id);
    await startCamera(nextCamera.id);
  };

  const toggleTorch = async () => {
    if (html5QrCodeRef.current && cameraActive) {
      try {
        await html5QrCodeRef.current.applyVideoConstraints({
          advanced: [{ torch: !torchOn }]
        });
        setTorchOn(!torchOn);
      } catch (err) {
        console.warn("Torch not supported on this hardware.");
      }
    }
  };

  const handleBarcodeScanned = async (barcode) => {
    const cleanCode = String(barcode).trim();
    if (!cleanCode) return;

    setLookupLoading(true);
    setScanError(null);

    try {
      const res = await barcodeAPI.lookup(cleanCode);
      if (res.data.found && res.data.product) {
        const prod = res.data.product;
        setDetectedProduct(prod);
        setModalOpen(true);

        // Add to recently scanned list
        setRecentlyScanned(prev => {
          const filtered = prev.filter(p => p.barcode !== prod.barcode);
          return [prod, ...filtered].slice(0, 5);
        });
      } else {
        setScanError(`Barcode "${cleanCode}" was not found in the supermarket database.`);
      }
    } catch (err) {
      const msg = err.response?.data?.error || `Unrecognized barcode: "${cleanCode}". Please verify product registration.`;
      setScanError(msg);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      handleBarcodeScanned(manualBarcode.trim());
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLookupLoading(true);
    setScanError(null);
    try {
      const scanner = getOrInitScanner();
      const decodedText = await scanner.scanFile(file, true);
      handleBarcodeScanned(decodedText);
    } catch (err) {
      setScanError("Could not detect a clear barcode in the uploaded image. Please ensure the barcode is visible and well-lit.");
    } finally {
      setLookupLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="min-h-screen bg-qc-canvas py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c1d3fe]/60 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Scan className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {t('scanner_title')}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {t('scanner_subtitle')}
            </p>
          </div>

          {/* Quick Cart Pill */}
          <Link
            to="/cart"
            className="self-start sm:self-auto flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-[#c1d3fe] dark:border-slate-800 shadow-sm hover:border-blue-500 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400">Cart Total</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                ₹{total.toFixed(2)} ({itemCount} items)
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 ml-1" />
          </Link>
        </div>

        {/* Scanner Viewport Section - Alice Blue & Lavender Border Theme */}
        <div className="relative rounded-3xl bg-slate-950 border-2 border-[#b6ccfe] dark:border-slate-800 p-4 sm:p-6 shadow-2xl overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-500/20 blur-3xl pointer-events-none" />

          {/* Camera Frame */}
          <div className="relative max-w-md mx-auto aspect-4/3 rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-inner flex flex-col items-center justify-center text-center p-4">
            
            {/* Target element for Html5Qrcode video injection */}
            <div id="reader" className="w-full h-full absolute inset-0 object-cover" />

            {!cameraActive && (
              <div className="relative z-10 space-y-4 max-w-xs px-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mx-auto flex items-center justify-center shadow-lg">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Camera Viewfinder Ready</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Activate camera for real-time laser detection on your device webcam or phone.
                  </p>
                </div>

                {availableCameras.length > 1 && (
                  <div className="w-full text-left">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Select Camera Device:</label>
                    <select
                      value={selectedCameraId || ''}
                      onChange={(e) => setSelectedCameraId(e.target.value)}
                      className="w-full py-1.5 px-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-cyan-400"
                    >
                      {availableCameras.map((cam) => (
                        <option key={cam.id} value={cam.id}>
                          {cam.label || `Camera ${cam.id.slice(0, 8)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    onClick={() => startCamera()}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                  >
                    Activate Live Camera
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-cyan-400" />
                    <span>Scan from Image / Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Viewfinder Target Overlay with Blue Laser Sweep */}
            {cameraActive && (
              <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                <div className="relative w-64 h-44 rounded-xl border-2 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  {/* Corner accents */}
                  <span className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-cyan-400" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-cyan-400" />
                  <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-cyan-400" />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-cyan-400" />

                  {/* Animated laser line */}
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 shadow-[0_0_12px_#06B6D4] animate-laser" />

                  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-cyan-300 uppercase whitespace-nowrap bg-slate-900/80 px-2 py-0.5 rounded">
                    ALIGN BARCODE HERE
                  </span>
                </div>
              </div>
            )}

            {/* Camera controls toolbar */}
            {cameraActive && (
              <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTorch}
                    className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      torchOn ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Flashlight className="w-4 h-4" />
                    <span className="hidden sm:inline">{torchOn ? 'Torch ON' : 'Torch'}</span>
                  </button>

                  {availableCameras.length > 1 && (
                    <button
                      onClick={switchCamera}
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Switch Camera (Front / Rear)"
                    >
                      <SwitchCamera className="w-4 h-4" />
                      <span className="hidden sm:inline">Flip</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={stopCamera}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold transition-colors"
                >
                  Stop Camera
                </button>
              </div>
            )}
          </div>

          {/* Camera Error banner if denied */}
          {cameraError && (
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Manual Barcode Input Bar */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder={t('scanner_manual_placeholder')}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 text-white rounded-xl text-sm font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={lookupLoading || !manualBarcode.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-all shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                {lookupLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Lookup Barcode</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Scan Error notification */}
          {scanError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-300">Product Not Found</p>
                <p className="mt-0.5 leading-relaxed">{scanError}</p>
                <p className="mt-1 text-[11px] text-rose-400">
                  Tip: Ensure the barcode is registered by the administrator in the Admin Product Hub.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* ONE-CLICK SCANNER SIMULATOR (Live Database Sync) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-[#c1d3fe] dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Supermarket Barcode Simulator
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Click any item to simulate an instant barcode scan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(liveCatalogProducts.length > 0 ? liveCatalogProducts.slice(0, 9) : fallbackBarcodes).map((item) => (
              <button
                key={item.barcode}
                onClick={() => handleBarcodeScanned(item.barcode)}
                className="group flex items-start justify-between p-3.5 rounded-2xl border border-[#d7e3fc] dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-[#edf2fb]/50 dark:bg-slate-800/40 hover:bg-[#e2eafc] dark:hover:bg-blue-950/40 transition-all text-left"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-[#c1d3fe] dark:border-slate-700">
                      {item.barcode}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      ₹{item.price}
                    </span>
                  </div>
                </div>
                <StatusBadge status={item.status || item.stockStatus} stock={item.stock} size="xs" />
              </button>
            ))}
          </div>
        </div>

        {/* Recently Scanned Shelf */}
        {recentlyScanned.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Recently Scanned in this Session ({recentlyScanned.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {recentlyScanned.map((prod) => (
                <div
                  key={prod.id || prod._id}
                  onClick={() => {
                    setDetectedProduct(prod);
                    setModalOpen(true);
                  }}
                  className="cursor-pointer p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-[#c1d3fe] dark:border-slate-800 hover:shadow-md transition-shadow space-y-2"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {prod.name}
                    </p>
                    <p className="text-xs font-extrabold text-blue-600 dark:text-cyan-400">
                      ₹{prod.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal Dialog for Exact Detected Product */}
      <ProductDetectionModal
        product={detectedProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default BarcodeScannerPage;
