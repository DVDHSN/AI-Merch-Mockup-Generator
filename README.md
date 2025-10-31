# AI Merch Mockup Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.25+-red.svg)](https://streamlit.io/)
[![Gemini AI Studio](https://img.shields.io/badge/Gemini-AI%20Studio-brightgreen.svg)](https://ai.google.com/)

An interactive web application that leverages the Gemini to generate unique, AI-powered designs and create realistic T-shirt mockups instantly.

---

## 📝 Description

This Streamlit application provides a seamless experience for creating merchandise mockups. Users can simply describe a design concept in plain English, and the app utilizes the power of DALL-E 3 to generate a corresponding image. This newly created design is then automatically placed onto a T-shirt template, producing a high-quality, realistic product mockup.

This tool is perfect for:
-   **Entrepreneurs** in the print-on-demand space looking to quickly prototype new ideas.
-   **Designers** seeking inspiration or a rapid visualization tool.
-   **Marketers** who need to create compelling product visuals for social media or ad campaigns.
-   **Anyone** who wants to bring their creative ideas to life on merchandise without needing complex design software.

## ✨ Key Features

-   **Text-to-Image Generation:** Utilizes the state-of-the-art DALL-E 3 API to convert text prompts into high-quality, unique designs.
-   **Automatic Mockup Creation:** Intelligently places the generated design onto a T-shirt template.
-   **Interactive Web Interface:** A simple and intuitive UI built with Streamlit makes the entire process effortless.
-   **Secure API Key Handling:** Safely use your OpenAI API key by loading it from an environment file or entering it into a secure password field in the app's sidebar.
-   **Downloadable Results:** Download the final T-shirt mockup as a PNG file with a single click.

## 🛠️ Tech Stack

-   **Framework:** [Streamlit](https://streamlit.io/)
-   **Language:** Python
-   **AI Model API:** [OpenAI DALL-E 3](https://openai.com/dall-e-3)
-   **Core Libraries:**
    -   `openai`: The official Python client for the OpenAI API.
    -   `Pillow`: For powerful image processing and manipulation.
    -   `python-dotenv`: For managing environment variables.
    -   `requests`: For making HTTP requests to download the generated images.

## 🚀 Installation & Setup

Follow these steps to get the AI Merch Mockup Generator running on your local machine.

### Prerequisites

-   Python 3.8 or higher
-   A Gemini API key with access to a Gemini model.

### Step-by-Step Guide

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/DVDHSN/AI-Merch-Mockup-Generator.git
    cd AI-Merch-Mockup-Generator
    ```

2.  **Create and Activate a Virtual Environment**
    -   **On macOS/Linux:**
        ```sh
        python3 -m venv venv
        source venv/bin/activate
        ```
    -   **On Windows:**
        ```sh
        python -m venv venv
        venv\Scripts\activate
        ```

3.  **Install Dependencies**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Set Up Environment Variables**
    Create a file named `.env` in the root directory of the project and add your OpenAI API key:
    ```
    OPENAI_API_KEY="your-gemini-api-key-here"
    ```
    This step is recommended for security. Alternatively, you can enter the key directly in the app's UI.

5.  **Run the Application**
    ```sh
    streamlit run app.py
    ```
    Your web browser should automatically open to the application's URL (usually `http://localhost:8501`).

## 👨‍💻 Usage

Once the application is running, follow these simple steps:

1.  If you did not set up the `.env` file, enter your OpenAI API key in the text input field in the sidebar.
2.  In the main text area, type a detailed description of the design you want to generate. Be as descriptive as possible for the best results!
    -   *Example prompt: "A minimalist line art drawing of a cat wearing glasses, vintage style."*
3.  Click the **"Generate Mockup"** button.
4.  Please wait a few moments while the DALL-E 3 API generates your design and the application creates the mockup.
5.  The final T-shirt mockup will be displayed on the page.
6.  Click the **"Download Mockup"** button to save the final image as a PNG file to your computer.

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features, improvements, or have found a bug, please feel free to contribute.

1.  **Fork** the repository.
2.  Create a new branch (`git checkout -b feature/YourAmazingFeature`).
3.  Make your changes and commit them (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/YourAmazingFeature`).
5.  Open a **Pull Request**.

You can also open an issue with the "bug" or "enhancement" tag.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/DVDHSN/AI-Merch-Mockup-Generator/blob/main/LICENSE) file for more details.
```
