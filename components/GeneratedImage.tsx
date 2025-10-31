import React, { useState } from 'react';
import JSZip from 'jszip';
import { DownloadIcon, EditIcon, ImageIcon, LoadingIcon, ZipIcon } from './Icons';
import { ProductType } from '../types';

interface GeneratedImageProps {
  generatedImages: string[] | null;
  loadingState: 'idle' | 'generating_logo' | 'generating_mockups' | 'editing';
  onEdit: (image: string) => void;
  aspectRatio: string;
  productTypes: ProductType[];
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ generatedImages, loadingState, onEdit, aspectRatio, productTypes }) => {
  const [isZipping, setIsZipping] = useState(false);
  
  const aspectRatioStyle = {
    aspectRatio: aspectRatio.replace(':', ' / '),
  };

  const handleDownloadAll = async () => {
    if (!generatedImages || generatedImages.length <= 1) return;
    setIsZipping(true);

    try {
        const zip = new JSZip();

        generatedImages.forEach((image, index) => {
            const productType = productTypes[index] || `image-${index + 1}`;
            const fileName = `mockup-${productType.replace(/\s+/g, '-')}.png`;
            const base64Data = image.split(',')[1];
            if (base64Data) {
                zip.file(fileName, base64Data, { base64: true });
            }
        });

        const content = await zip.generateAsync({ type: 'blob' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'generated-mockups.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

    } catch(err) {
        console.error("Failed to create zip file", err);
        // In a real app, you might want to show an error to the user here.
    } finally {
        setIsZipping(false);
    }
  };


  const getLoadingText = () => {
    if (loadingState === 'editing') {
      return "Applying your edits...";
    }
    if (loadingState === 'generating_mockups') {
      return productTypes.length > 1 ? "Rendering your mockups..." : "Rendering your mockup...";
    }
    return "Loading..."; // Fallback
  };

  if (loadingState === 'generating_mockups' || loadingState === 'editing') {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 w-full" style={aspectRatioStyle}>
        <LoadingIcon />
        <p className="mt-4 text-lg animate-pulse">{getLoadingText()}</p>
        <p className="text-sm text-gray-500 mt-1">This may take a moment.</p>
      </div>
    );
  }

  if (generatedImages && generatedImages.length > 0) {
    // Single image view
    if (generatedImages.length === 1) {
        const image = generatedImages[0];
        return (
            <div className="w-full flex flex-col items-center gap-4">
                <div className="w-full bg-black/20 rounded-lg overflow-hidden" style={aspectRatioStyle}>
                    <img src={image} alt="Generated Mockup" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                    <a
                      href={image}
                      download="generated-image.png"
                      className="inline-flex items-center gap-2 py-2 px-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300 transform hover:scale-105 active:scale-100"
                    >
                      <DownloadIcon />
                      Download Image
                    </a>
                    <button
                        onClick={() => onEdit(image)}
                        className="inline-flex items-center gap-2 py-2 px-6 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105 active:scale-100"
                    >
                        <EditIcon />
                        Edit Mockup
                    </button>
                </div>
            </div>
        );
    }

    // Gallery view for multiple images
    return (
        <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-xl font-bold text-cyan-400">Generated Mockups</h3>
                <button
                    onClick={handleDownloadAll}
                    disabled={isZipping}
                    className="inline-flex items-center gap-2 py-2 px-4 bg-teal-600 text-white font-bold text-sm rounded-lg hover:bg-teal-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isZipping ? (
                        <>
                            <LoadingIcon />
                            Zipping...
                        </>
                    ) : (
                        <>
                            <ZipIcon />
                            Download All (.zip)
                        </>
                    )}
                </button>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedImages.map((image, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 bg-gray-900/50 p-3 rounded-lg">
                        <div className="w-full bg-black/20 rounded-lg overflow-hidden" style={aspectRatioStyle}>
                            <img src={image} alt={`Generated Mockup ${index + 1}`} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 mt-1">
                            {productTypes[index] && <span className="text-sm font-semibold capitalize bg-gray-700 px-2 py-1 rounded">{productTypes[index]}</span>}
                            <a
                                href={image}
                                download={`generated-mockup-${productTypes[index] || index}.png`}
                                className="inline-flex items-center gap-2 py-1.5 px-3 bg-green-600/80 text-white font-bold text-xs rounded-md hover:bg-green-600 transition-colors duration-300"
                            >
                                <DownloadIcon /> Download
                            </a>
                            <button
                                onClick={() => onEdit(image)}
                                className="inline-flex items-center gap-2 py-1.5 px-3 bg-purple-600/80 text-white font-bold text-xs rounded-md hover:bg-purple-600 transition-colors duration-300"
                            >
                                <EditIcon /> Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-gray-500 w-full" style={aspectRatioStyle}>
      <ImageIcon />
      <p className="mt-4 text-lg">Your generated image will appear here</p>
    </div>
  );
};

export default GeneratedImage;