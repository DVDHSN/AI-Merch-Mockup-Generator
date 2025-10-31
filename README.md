🤖 AI Merch Mockup Generator
An open-source, AI-powered tool to generate realistic mockups for your merchandise designs in seconds. Simply upload your logo, describe the scene, and let AI create a unique, high-quality image of a model wearing your design.



📄 Description
The AI Merch Mockup Generator is a powerful yet easy-to-use application designed for creators, designers, and e-commerce entrepreneurs. It leverages the capabilities of state-of-the-art text-to-image AI via an external API to eliminate the need for expensive photoshoots and complex design software.

With this tool, you can:

Instantly visualize your t-shirt, hoodie, or other apparel designs on AI-generated models.
Create diverse and unique promotional materials for your online store or social media.
Experiment with different styles, settings, and model appearances using simple text prompts.
The application intelligently removes the background from your logo, generates a base image according to your prompt via the AI service, and seamlessly overlays your design onto the apparel, giving you full control over its size and position.

✨ Key Features
AI-Powered Image Generation: Connects to an external AI service to create high-resolution, photorealistic images from text prompts.
Automatic Background Removal: Intelligently removes the background from your uploaded logo for a clean overlay.
Customizable Logo Placement: Easy-to-use sliders to precisely control the size, horizontal, and vertical position of your logo on the mockup.
Fine-Tuned Control: Use positive and negative prompts to guide the AI and get the exact scene you envision.
Intuitive Web Interface: Simple and user-friendly UI built with Gradio, requiring no technical expertise to use.
Open Source: Free to use, modify, and extend. Fork the repository and make it your own!
🛠️ Tech Stack
This project is built with a powerful stack of open-source technologies:

Backend: Python
External AI Integration: Interfaces with a third-party AI service via API for image generation and background removal.
Web UI: Gradio
Image Processing: Pillow, OpenCV
🚀 Installation & Setup
Follow these steps to get the AI Merch Mockup Generator running on your local machine.

Prerequisites:

Python 3.8+
Git
An API key for the integrated AI service.
Step-by-step Guide:

Clone the Repository

git clone https://github.com/DVDHSN/AI-Merch-Mockup-Generator.git
cd AI-Merch-Mockup-Generator
Create a Virtual Environment (Recommended)

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate

# For Windows
python -m venv venv
.\venv\Scripts\activate
Install Dependencies Install the required Python packages using pip.

pip install -r requirements.txt
Configure API Key Create a .env file in the project root and add your API key for the external AI service:

AI_API_KEY="YOUR_API_KEY_HERE"
Run the Application

python app.py
Access the Web UI Once the script is running, you will see a local URL in your terminal (usually http://127.0.0.1:7860). Open this URL in your web browser to start creating mockups.

💡 Usage
Using the application is straightforward:

Upload Logo: Drag and drop or click to upload your logo image (PNG with a transparent background works best).
Write a Prompt: In the "Prompt" text box, describe the model and the scene you want. Be specific for better results.
Example: "Photo of a young man with blonde hair wearing a plain black t-shirt, standing in a sunny park."
Add a Negative Prompt (Optional): In the "Negative Prompt" text box, describe what you want to avoid in the image.
Example: "blurry, logos, text, watermark, extra limbs, poorly drawn, cartoon"
Adjust Logo Position: Use the sliders for "Logo Size", "Horizontal Position", and "Vertical Position" to place the logo exactly where you want it on the t-shirt.
Generate: Click the "Generate Mockup" button and wait for the AI service to create your image. The final mockup will appear in the output panel.
![Example Output]: generated-image (1)

🤝 Contributing
Contributions are welcome! If you have an idea for a new feature, find a bug, or want to improve the project, please feel free to contribute.

Fork the repository on GitHub.
Clone your forked repository to your local machine.
Create a new branch for your feature or bug fix: git checkout -b feature/your-feature-name.
Make your changes and commit them with a descriptive message.
Push your changes to your forked repository: git push origin feature/your-feature-name.
Open a Pull Request on the original repository, detailing the changes you've made.
Please open an issue first to discuss any significant changes you would like to make.

📜 License
This project is licensed under the Apache 2.0 License. See the LICENSE file for more details.


