# Weather Prediction and Crop Recommendation System

## Overview
This project aims to develop a web application that predicts weather patterns and recommends suitable crops based on meteorological data and past agricultural yields. The system utilizes Long Short-Term Memory (LSTM) models for weather forecasting and a Random Forest model for crop recommendation.

## Features
- **Data Processing**: Scales and normalizes meteorological data for LSTM modeling.
- **Weather Prediction**: Forecasts future weather patterns using a trained LSTM model.
- **Crop Suitability Analysis**: Integrates past agricultural data with forecasted meteorological data to analyze crop suitability.
- **Crop Recommendation**: Suggests appropriate crops along with estimated yields using a trained Random Forest model.

## Technologies Used
- **Back-End**: Python
  - Libraries: TensorFlow, scikit-learn, Keras
- **Cloud Platform**: Google Cloud Platform (GCP) or other cloud providers

## Database
- **Weather Data**: 4018 weather points collected over ten years (from January 1, 2009, to January 1, 2020) using variables such as:
  - `maxtempC`
  - `mintempC`
  - `sunHour`
  - `humidity`
  - `precipMM`
  - `pressure`
  - `tempC`
  - `windspeedKmph`
  
- **Crop Data**: A dataset of crops across India, adaptable for use with local datasets such as those from Hyderabad.
