import React, { useState, useCallback, useEffect } from 'react';
import { editImage, generateLogo } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import GeneratedImage from './components/GeneratedImage';
import ProductSelector from './components/ProductSelector';
import AspectRatioSelector from './components/AspectRatioSelector';
import { BackIcon, LoadingIcon, OpacityIcon, PositionIcon, RotateIcon, SizeIcon, SparklesIconSmall, TshirtIcon, MugIcon, HatIcon, StickerIcon, PhoneCaseIcon, PosterIcon, ToteBagIcon, CustomProductIcon, CloseIcon, TextIcon, BoldIcon, ItalicIcon } from './components/Icons';
import type { OriginalImage, ProductType, AspectRatio } from './types';

const initialProducts: { id: ProductType; name: string; icon: React.ReactElement }[] = [
  { id: 't-shirt', name: 'T-Shirt', icon: <TshirtIcon /> },
  { id: 'mug', name: 'Mug', icon: <MugIcon /> },
  { id: 'hat', name: 'Hat', icon: <HatIcon /> },
  { id: 'sticker', name: 'Sticker', icon: <StickerIcon /> },
  { id: 'phone case', name: 'Phone Case', icon: <PhoneCaseIcon /> },
  { id: 'poster', name: 'Poster', icon: <PosterIcon /> },
  { id: 'tote bag', name: 'Tote Bag', icon: <ToteBagIcon /> },
];

const fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Impact', 'Lobster', 'Roboto', 'Montserrat', 'Playfair Display'];

type LoadingState = 'idle' | 'generating_logo' | 'refining_logo' | 'generating_mockups' | 'editing';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [logoSize, setLogoSize] = useState<number>(100);
  const [logoOpacity, setLogoOpacity] = useState<number>(100);
  const [logoRotation, setLogoRotation] = useState<number>(0);
  const [logoPositionX, setLogoPositionX] = useState<number>(0);
  const [logoPositionY, setLogoPositionY] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [logoInputMode, setLogoInputMode] = useState<'upload' | 'generate'>('upload');
  const [logoPrompt, setLogoPrompt] = useState<string>('');
  const [availableProducts, setAvailableProducts] = useState(initialProducts);
  const [logoVariations, setLogoVariations] = useState<string[] | null>(null);
  const [logoRefinementPrompt, setLogoRefinementPrompt] = useState<string>('');

  // State for text overlay
  const [isTextOverlayEnabled, setIsTextOverlayEnabled] = useState(false);
  const [overlayText, setOverlayText] = useState('');
  const [overlayFont, setOverlayFont] = useState('Arial');
  const [overlayFontSize, setOverlayFontSize] = useState(32);
  const [overlayColor, setOverlayColor] = useState('#ffffff');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);


  const productPrompts: Record<string, string> = {
    't-shirt': 'Place this logo on a plain white t-shirt worn by a model, studio lighting.',
    'mug': 'Show this design on a black ceramic coffee mug on a wooden table.',
    'hat': 'Generate a mockup of this logo on a black baseball cap.',
    'sticker': 'Create a realistic die-cut sticker mockup of this image with a white border, on a laptop.',
    'phone case': 'Mock up this design on a clear phone case for a modern smartphone.',
    'poster': 'Generate a mockup of this art as a framed poster hanging on a gallery wall.',
    'tote bag': 'Place this graphic on a canvas tote bag held by a person.',
  };
  
  const getProductPrompt = useCallback((product: ProductType): string => {
    if (product in productPrompts) {
        return productPrompts[product];
    }
    const customProduct = availableProducts.find(p => p.id === product);
    const productName = customProduct ? customProduct.name : product;
    // Make the custom prompt more descriptive to guide the AI better
    return `Generate a realistic mockup of this logo on a ${productName}, with professional, clean, studio lighting.`;
  }, [availableProducts, productPrompts]);

  useEffect(() => {
    // Clear the uploaded/generated logo when switching logo input modes
    setOriginalImage(null);
    setLogoVariations(null);
  }, [logoInputMode]);

  const handleImageUpload = useCallback((image: OriginalImage) => {
    setOriginalImage(image);
    setGeneratedImages(null);
    setError(null);
  }, []);
  
  const handleToggleProduct = useCallback((product: ProductType) => {
    setGeneratedImages(null);
    setError(null);

    const newSelection = selectedProducts.includes(product)
      ? selectedProducts.filter(p => p !== product)
      : [...selectedProducts, product];
      
    setSelectedProducts(newSelection);

    if (!isEditingMode) {
      if (newSelection.length === 1) {
        setPrompt(getProductPrompt(newSelection[0]));
      } else {
        // Clear prompt for 0 or >1 selections to allow for general refinements
        setPrompt('');
      }
    }
  }, [selectedProducts, isEditingMode, getProductPrompt]);

  const handleAddProduct = useCallback((productName: string) => {
    const productID = productName.toLowerCase().replace(/\s+/g, '-');
    
    // Check if product already exists
    if (availableProducts.some(p => p.id === productID)) {
        if (!selectedProducts.includes(productID)) {
            handleToggleProduct(productID);
        }
        return;
    }

    const newProduct = {
        id: productID,
        name: productName,
        icon: <CustomProductIcon />,
    };

    setAvailableProducts(prev => [...prev, newProduct]);
    // Toggle selection for the new product
    const newSelection = [...selectedProducts, productID];
    setSelectedProducts(newSelection);
    if (!isEditingMode) {
      if (newSelection.length === 1) {
        setPrompt(getProductPrompt(newSelection[0]));
      } else {
        setPrompt('');
      }
    }
  }, [availableProducts, selectedProducts, isEditingMode, getProductPrompt, handleToggleProduct]);

  const handleStartEditing = useCallback((imageToEdit: string) => {
    if (!imageToEdit) return;

    const parts = imageToEdit.split(',');
    const base64 = parts[1];
    const mimeType = parts[0]?.split(':')[1]?.split(';')[0];

    if (!base64 || !mimeType) {
      setError("Could not process the generated image for editing.");
      return;
    }

    setOriginalImage({ base64, mimeType });
    setIsEditingMode(true);
    setGeneratedImages(null);
    setSelectedProducts([]);
    setPrompt('');
    setLogoSize(100);
    setLogoOpacity(100);
    setLogoRotation(0);
    setLogoPositionX(0);
    setLogoPositionY(0);
    setIsTextOverlayEnabled(false);
    setOverlayText('');
    setOverlayFont('Arial');
    setOverlayFontSize(32);
    setOverlayColor('#ffffff');
    setIsBold(false);
    setIsItalic(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartOver = useCallback(() => {
    setOriginalImage(null);
    setSelectedProducts([]);
    setPrompt('');
    setGeneratedImages(null);
    setLoadingState('idle');
    setError(null);
    setIsEditingMode(false);
    setLogoSize(100);
    setLogoOpacity(100);
    setLogoRotation(0);
    setLogoPositionX(0);
    setLogoPositionY(0);
    setAspectRatio('1:1');
    setLogoInputMode('upload');
    setLogoPrompt('');
    setAvailableProducts(initialProducts);
    setLogoVariations(null);
    setLogoRefinementPrompt('');
    setIsTextOverlayEnabled(false);
    setOverlayText('');
    setOverlayFont('Arial');
    setOverlayFontSize(32);
    setOverlayColor('#ffffff');
    setIsBold(false);
    setIsItalic(false);
  }, []);
  
  const handleGenerateLogo = async () => {
    if (!logoPrompt) {
        setError("Please describe the logo you want to generate.");
        return;
    }
    setLoadingState('generating_logo');
    setError(null);
    setOriginalImage(null);
    setLogoVariations(null);
    setLogoRefinementPrompt('');
    try {
        const variations = await generateLogo(logoPrompt);
        if (variations && variations.length > 0) {
            setLogoVariations(variations);
        } else {
            setError("Failed to generate logo variations. The model may have returned an empty response.");
        }
    } catch (e: any) {
        console.error("Error generating logo variations:", e);
        setError(`An error occurred while generating logo variations: ${e.message}`);
    } finally {
        setLoadingState('idle');
    }
  };

  const handleRefineLogo = async () => {
    if (!logoRefinementPrompt) {
        setError("Please describe how you'd like to refine the logo.");
        return;
    }
    if (!logoPrompt) {
        setError("Cannot refine without an initial logo prompt.");
        return;
    }
    setLoadingState('refining_logo');
    setError(null);
    setLogoVariations(null);

    try {
        const combinedPrompt = `${logoPrompt}, ${logoRefinementPrompt}`;
        const variations = await generateLogo(combinedPrompt);
        if (variations && variations.length > 0) {
            setLogoVariations(variations);
        } else {
            setError("Failed to generate refined variations. The model may have returned an empty response.");
        }
    } catch (e: any) {
        console.error("Error generating refined variations:", e);
        setError(`An error occurred while refining the logo: ${e.message}`);
    } finally {
        setLoadingState('idle');
    }
  };

  const handleSelectLogoVariation = (logoBase64: string) => {
      handleImageUpload({
          base64: logoBase64,
          mimeType: 'image/png'
      });
      setLogoVariations(null);
      setLogoRefinementPrompt('');
  };

  const getQualitativeFontSize = (size: number): string => {
    if (size < 24) return 'very small';
    if (size < 40) return 'small';
    if (size < 60) return 'medium';
    if (size < 80) return 'large';
    return 'very large';
  };


  const handleGenerate = async () => {
    setLoadingState(isEditingMode ? 'editing' : 'generating_mockups');
    setError(null);
    setGeneratedImages(null);

    try {
      if (!originalImage) {
        setError('Please upload or generate a logo first.');
        setLoadingState('idle');
        return;
      }

      if (isEditingMode) {
          let finalPrompt = prompt;
          const controlPrompts: string[] = [];

          // Logo transformation prompts
          const sizeDifference = logoSize - 100;
          if (Math.abs(sizeDifference) > 0) controlPrompts.push(`make the logo ${Math.abs(sizeDifference)}% ${sizeDifference > 0 ? 'larger' : 'smaller'}`);
          if (logoOpacity < 100) controlPrompts.push(`set the logo opacity to ${logoOpacity}%`);
          if (logoRotation !== 0) controlPrompts.push(`rotate the logo by ${Math.abs(logoRotation)} degrees ${logoRotation > 0 ? 'clockwise' : 'counter-clockwise'}`);
          if (logoPositionX !== 0) controlPrompts.push(`shift the logo ${Math.abs(logoPositionX)}% to the ${logoPositionX > 0 ? 'right' : 'left'}`);
          if (logoPositionY !== 0) controlPrompts.push(`move the logo ${Math.abs(logoPositionY)}% ${logoPositionY > 0 ? 'down' : 'up'}`);

          // Text overlay prompts
          if (isTextOverlayEnabled && overlayText.trim()) {
            const textStyles = [];
            if (isBold) textStyles.push('bold');
            if (isItalic) textStyles.push('italic');
            
            const styleString = textStyles.length > 0 ? ` in a ${textStyles.join(' and ')} style` : '';
            const sizeString = getQualitativeFontSize(overlayFontSize);
        
            const textInstruction = `Overlay the text "${overlayText.trim()}"${styleString}. Use a ${sizeString}, ${overlayFont}-like font in the color ${overlayColor}.`;
            controlPrompts.push(textInstruction);
          }

          if (controlPrompts.length > 0) {
            const controlInstruction = controlPrompts.join(' and ');
            const capitalizedInstruction = controlInstruction.charAt(0).toUpperCase() + controlInstruction.slice(1);
            finalPrompt = finalPrompt ? `${finalPrompt}. ${capitalizedInstruction}.` : `${capitalizedInstruction}.`;
          }
          
          if (!finalPrompt) {
              setError('Please describe an edit or adjust the controls.');
              setLoadingState('idle');
              return;
          }
          const result = await editImage(originalImage.base64, originalImage.mimeType, finalPrompt);
          if (result) {
              setGeneratedImages([`data:image/png;base64,${result}`]);
          }
      } else {
          if (selectedProducts.length === 0) {
              setError('Please select at least one product type.');
              setLoadingState('idle');
              return;
          }

          let generationPromises;

          if (selectedProducts.length === 1) {
              // For a single product, the `prompt` from state is the full and final prompt.
              const finalPrompt = `${prompt}. Generate the image in a ${aspectRatio} aspect ratio.`;
              generationPromises = [editImage(originalImage.base64, originalImage.mimeType, finalPrompt)];
          } else {
              // For multiple products, `prompt` is a general refinement for each base prompt.
              generationPromises = selectedProducts.map(product => {
                  const basePrompt = getProductPrompt(product);
                  const refinedPrompt = prompt ? `${basePrompt}. ${prompt}` : basePrompt;
                  const finalPrompt = `${refinedPrompt}. Generate the image in a ${aspectRatio} aspect ratio.`;
                  return editImage(originalImage.base64, originalImage.mimeType, finalPrompt);
              });
          }

          const results = await Promise.all(generationPromises);
          const successfulImages = results.filter((img): img is string => img !== null);

          if (successfulImages.length > 0) {
              setGeneratedImages(successfulImages.map(img => `data:image/png;base64,${img}`));
          }

          if (successfulImages.length < selectedProducts.length) {
              const failedCount = selectedProducts.length - successfulImages.length;
              setError(`Failed to generate ${failedCount} mockup(s). Please try again.`);
          }

          if (successfulImages.length === 0) {
              setError('Failed to generate any mockups. The model may have returned an empty response.');
          }
      }

    } catch (e: any) {
      console.error(e);
      setError(`An error occurred: ${e.message}`);
    } finally {
      setLoadingState('idle');
    }
  };
  
  const getPromptLabel = () => {
    if (isEditingMode) return '3. Describe Your Edit (Optional)';
    if (selectedProducts.length > 1) return '4. Add a General Refinement (Optional)';
    return '4. Refine your Mockup';
  };

  const hasMadeEdit = isEditingMode && (
      prompt ||
      logoSize !== 100 ||
      logoOpacity !== 100 ||
      logoRotation !== 0 ||
      logoPositionX !== 0 ||
      logoPositionY !== 0 ||
      (isTextOverlayEnabled && !!overlayText.trim())
  );

  const isGenerateDisabled = loadingState !== 'idle' ||
    !originalImage ||
    (!isEditingMode && selectedProducts.length === 0) ||
    (isEditingMode && !hasMadeEdit);

  const isLogoGenDisabled = loadingState === 'generating_logo' || loadingState === 'refining_logo';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Input Panel */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col space-y-6 h-fit">
            {isEditingMode ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-cyan-400">Edit Mockup</h2>
                  <button
                      onClick={handleStartOver}
                      className="flex items-center gap-2 py-1.5 px-3 bg-gray-700/50 text-gray-300 font-semibold text-sm rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
                  >
                      <BackIcon />
                      Back to Home
                  </button>
                </div>
                <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 bg-gray-900/50 min-h-[224px] flex items-center justify-center">
                    {originalImage && <img src={`data:${originalImage.mimeType};base64,${originalImage.base64}`} alt="Currently editing" className="mx-auto max-h-48 rounded-md object-contain" />}
                </div>
                <div className="space-y-4 mt-4 pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-cyan-400 -mb-2">1. Adjust Logo</h3>
                    <div>
                        <label htmlFor="logoSize" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                        <SizeIcon /> Logo Size: <span className="font-mono text-white">{logoSize}%</span>
                        </label>
                        <input
                            id="logoSize"
                            type="range"
                            min="50"
                            max="150"
                            value={logoSize}
                            onChange={(e) => setLogoSize(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            disabled={loadingState !== 'idle'}
                        />
                    </div>
                    <div>
                        <label htmlFor="logoOpacity" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                        <OpacityIcon /> Logo Opacity: <span className="font-mono text-white">{logoOpacity}%</span>
                        </label>
                        <input
                            id="logoOpacity"
                            type="range"
                            min="10"
                            max="100"
                            step="10"
                            value={logoOpacity}
                            onChange={(e) => setLogoOpacity(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            disabled={loadingState !== 'idle'}
                        />
                    </div>
                    <div>
                        <label htmlFor="logoRotation" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                        <RotateIcon /> Rotation: <span className="font-mono text-white">{logoRotation}°</span>
                        </label>
                        <input
                            id="logoRotation"
                            type="range"
                            min="-180"
                            max="180"
                            value={logoRotation}
                            onChange={(e) => setLogoRotation(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            disabled={loadingState !== 'idle'}
                        />
                    </div>
                     <div>
                        <label htmlFor="logoPositionX" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                          <PositionIcon /> Position (X/Y): <span className="font-mono text-white">{logoPositionX}% / {logoPositionY}%</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    id="logoPositionX"
                                    type="range"
                                    min="-50"
                                    max="50"
                                    value={logoPositionX}
                                    onChange={(e) => setLogoPositionX(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                    disabled={loadingState !== 'idle'}
                                />
                                <span className="text-xs text-center block text-gray-400 mt-1">Horizontal</span>
                            </div>
                            <div>
                                <input
                                    id="logoPositionY"
                                    type="range"
                                    min="-50"
                                    max="50"
                                    value={logoPositionY}
                                    onChange={(e) => setLogoPositionY(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                    disabled={loadingState !== 'idle'}
                                />
                                <span className="text-xs text-center block text-gray-400 mt-1">Vertical</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4 mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                         <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2"><TextIcon /> 2. Add Text Overlay</h3>
                         <label htmlFor="enableTextOverlay" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" id="enableTextOverlay" className="sr-only" checked={isTextOverlayEnabled} onChange={() => setIsTextOverlayEnabled(!isTextOverlayEnabled)} />
                                <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isTextOverlayEnabled ? 'translate-x-full bg-cyan-400' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                    {isTextOverlayEnabled && (
                        <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
                            <textarea
                                value={overlayText}
                                onChange={(e) => setOverlayText(e.target.value)}
                                placeholder="Your text here..."
                                className="w-full h-20 p-2 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                disabled={loadingState !== 'idle'}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Font</label>
                                    <select value={overlayFont} onChange={(e) => setOverlayFont(e.target.value)} className="w-full p-2 bg-gray-700 border-gray-600 rounded-lg text-sm" disabled={loadingState !== 'idle'}>
                                        {fonts.map(font => <option key={font} value={font}>{font}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Size: <span className="font-mono text-white">{overlayFontSize}px</span></label>
                                     <input
                                        type="range" min="12" max="100"
                                        value={overlayFontSize}
                                        onChange={(e) => setOverlayFontSize(parseInt(e.target.value, 10))}
                                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                        disabled={loadingState !== 'idle'}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Color</label>
                                    <input type="color" value={overlayColor} onChange={(e) => setOverlayColor(e.target.value)} className="w-12 h-10 p-1 bg-gray-700 border-gray-600 rounded-lg cursor-pointer" disabled={loadingState !== 'idle'} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Style</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsBold(!isBold)} className={`p-2 rounded-lg ${isBold ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`} disabled={loadingState !== 'idle'}><BoldIcon /></button>
                                        <button onClick={() => setIsItalic(!isItalic)} className={`p-2 rounded-lg ${isItalic ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`} disabled={loadingState !== 'idle'}><ItalicIcon /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              </div>
            ) : (
              <>
                <div>
                    <label className="text-xl font-semibold text-cyan-400 mb-2 block">1. Provide your Logo</label>
                    <div className="flex bg-gray-700 rounded-lg p-1 mb-4">
                        <button
                            onClick={() => setLogoInputMode('upload')}
                            className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${logoInputMode === 'upload' ? 'bg-cyan-600/80 text-white' : 'text-gray-300 hover:bg-gray-600/50'}`}
                        >
                            Upload Logo
                        </button>
                        <button
                            onClick={() => setLogoInputMode('generate')}
                            className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${logoInputMode === 'generate' ? 'bg-cyan-600/80 text-white' : 'text-gray-300 hover:bg-gray-600/50'}`}
                        >
                            Generate Logo
                        </button>
                    </div>
                    {logoInputMode === 'upload' ? (
                        <ImageUploader onImageUpload={handleImageUpload} />
                    ) : (
                        <div className="space-y-4">
                             {originalImage ? (
                                <div className="relative border-2 border-dashed border-cyan-500 rounded-lg p-4 bg-gray-900/50 mt-4">
                                    <p className="text-xs text-cyan-400 mb-2 text-center font-semibold">Selected Logo:</p>
                                    <img src={`data:${originalImage.mimeType};base64,${originalImage.base64}`} alt="Selected Logo" className="mx-auto max-h-48 rounded-md object-contain" />
                                     <button onClick={() => { setOriginalImage(null); setLogoVariations(null); }} className="absolute top-1 right-1 p-1.5 bg-gray-800/50 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                                        <CloseIcon />
                                    </button>
                                </div>
                            ) : logoVariations ? (
                                 <div className="space-y-4 pt-4 border-t border-gray-700">
                                    <p className="text-center text-gray-300">Select your favorite, or refine your prompt below.</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {logoVariations.map((logo, index) => (
                                            <button 
                                                key={index} 
                                                onClick={() => handleSelectLogoVariation(logo)}
                                                className="rounded-lg overflow-hidden border-2 border-transparent hover:border-cyan-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200 aspect-square"
                                            >
                                                <img src={`data:image/png;base64,${logo}`} alt={`Logo variation ${index + 1}`} className="w-full h-full object-contain bg-gray-900/50" />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={logoRefinementPrompt}
                                        onChange={(e) => setLogoRefinementPrompt(e.target.value)}
                                        placeholder="e.g., 'make it more abstract', 'use pastel colors'"
                                        className="w-full h-20 p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 placeholder-gray-400"
                                        disabled={isLogoGenDisabled}
                                    />
                                    <button
                                        onClick={handleRefineLogo}
                                        disabled={isLogoGenDisabled || !logoRefinementPrompt}
                                        className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-purple-600 text-white font-bold text-sm rounded-lg hover:bg-purple-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    >
                                        {loadingState === 'refining_logo' ? <><LoadingIcon /> Refining...</> : <><SparklesIconSmall /> Refine Variations</>}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <textarea
                                        value={logoPrompt}
                                        onChange={(e) => setLogoPrompt(e.target.value)}
                                        placeholder="e.g., 'a smiling red panda'"
                                        className="w-full h-20 p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 placeholder-gray-400"
                                        disabled={isLogoGenDisabled}
                                    />
                                    <button
                                        onClick={handleGenerateLogo}
                                        disabled={isLogoGenDisabled || !logoPrompt}
                                        className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-purple-600 text-white font-bold text-sm rounded-lg hover:bg-purple-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    >
                                        {loadingState === 'generating_logo' ? <><LoadingIcon /> Generating...</> : <><SparklesIconSmall /> Generate Variations</>}
                                    </button>
                                </>
                            )}
                            {(loadingState === 'generating_logo' || loadingState === 'refining_logo') && <p className="text-center text-sm text-gray-400 animate-pulse">{loadingState === 'generating_logo' ? 'Creating logo variations...' : 'Applying your refinements...'}</p>}
                        </div>
                    )}
                </div>
                 {originalImage && !isEditingMode && (
                  <>
                    <div>
                      <label className="text-xl font-semibold text-cyan-400 mb-2 block">2. Select Product Type(s)</label>
                      <ProductSelector
                        products={availableProducts}
                        selectedProducts={selectedProducts}
                        onToggleProduct={handleToggleProduct}
                        onAddProduct={handleAddProduct}
                        disabled={loadingState !== 'idle'}
                      />
                    </div>
                    <div>
                        <label className="text-xl font-semibold text-cyan-400 mb-2 block">3. Select Aspect Ratio</label>
                        <AspectRatioSelector selectedAspectRatio={aspectRatio} onSelectAspectRatio={setAspectRatio} disabled={loadingState !== 'idle'} />
                    </div>
                  </>
                )}
              </>
            )}
            
            {originalImage && (
              <div className="pt-4 border-t border-gray-700">
                <label htmlFor="prompt" className="text-lg font-semibold text-cyan-400 mb-2 block">
                  {getPromptLabel()}
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                      isEditingMode ? "e.g., 'Change the background to a park'" : 
                      selectedProducts.length > 1 ? "e.g., 'with a minimalist aesthetic'" :
                      selectedProducts.length === 1 ? getProductPrompt(selectedProducts[0]) : "Select a product to begin."
                  }
                  className="w-full h-28 p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 placeholder-gray-400"
                  disabled={loadingState !== 'idle'}
                />
              </div>
            )}
            {originalImage && (
              <button
                onClick={handleGenerate}
                disabled={isGenerateDisabled}
                className="w-full flex justify-center items-center gap-3 py-3 px-6 bg-cyan-600 text-white font-bold text-lg rounded-lg hover:bg-cyan-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md disabled:shadow-none transform hover:scale-105 active:scale-100"
              >
                {loadingState === 'generating_mockups' || loadingState === 'editing' ? (
                  <>
                    <LoadingIcon />
                    {loadingState === 'editing' ? 'Applying Edits...' : 'Rendering Mockups...'}
                  </>
                ) : (isEditingMode ? 'Apply Edit' : 'Generate Mockup')}
              </button>
            )}
            {error && <p className="text-red-400 text-center mt-2">{error}</p>}
          </div>

          {/* Output Panel */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[400px] lg:min-h-0">
            <GeneratedImage generatedImages={generatedImages} loadingState={loadingState} onEdit={handleStartEditing} aspectRatio={aspectRatio} productTypes={selectedProducts} />
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by Gemini and Imagen</p>
      </footer>
    </div>
  );
};

export default App;