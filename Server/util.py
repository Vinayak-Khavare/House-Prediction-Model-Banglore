import pickle
import json
import numpy as np
import pandas as pd

__location = None
__data_columns = None
__model = None

def get_location_names():
    return __location

def get_estimated_price(location, total_sqft, bhk, bath):
    location = location.strip()
    try:
        loc_index = __data_columns.index(location)
    except:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = total_sqft
    x[1] = bhk
    x[2] = bath
    if loc_index >= 0:
        x[loc_index] = 1

    x = pd.DataFrame([x], columns=__data_columns)
    return round(__model.predict(x)[0], 2)

def load_saved_artifacts():
    print("Loading saved artifacts...start")
    global __data_columns
    global __location

    with open("C:\\Project\\Project 14 - Banglore House Prices\\Server\\artifacts\\columns.json", "r") as f:
        __data_columns = json.load(f)['data_columns']
        __location = __data_columns[3:]

    global __model
    if __model is None:
        with open("C:\\Project\\Project 14 - Banglore House Prices\\Server\\artifacts\\House_Prediction_model.pickle", 'rb') as f:
            __model = pickle.load(f)
    print("Loading saved artifacts...done")

if __name__ == '__main__':
    load_saved_artifacts()
    # print(get_location_names())
    # print(get_estimated_price('1st Phase JP Nagar', 1000, 3, 3))
    # print(get_estimated_price('1st Phase JP Nagar', 1000, 2, 2))
    # print(get_estimated_price('Kalhalli', 1000, 2, 2))  # other location
    # print(get_estimated_price('Ejipura', 1000, 2, 2))  # other location