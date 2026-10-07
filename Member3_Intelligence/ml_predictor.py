import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


# ============================================================
# TRAIN REPAIR-TIME PREDICTION MODEL
# ============================================================

def train_repair_time_model(data):

    rows = []

    # Convert historical service records into ML training data
    for history in data["service_history"]:

        technician = next(
            (
                tech
                for tech in data["technicians"]
                if tech["technician_id"]
                == history["technician_id"]
            ),
            None
        )

        if technician is None:
            continue

        rows.append({
            "machine_type":
                history["machine_type"],

            "fault_type":
                history["fault_type"],

            "technician_id":
                history["technician_id"],

            "experience_years":
                technician["experience_years"],

            "resolution_minutes":
                history["resolution_minutes"]
        })


    # --------------------------------------------------------
    # SAFETY CHECK
    # --------------------------------------------------------

    if not rows:
        raise ValueError(
            "No service history available for ML training."
        )


    # --------------------------------------------------------
    # CREATE DATAFRAME
    # --------------------------------------------------------

    df = pd.DataFrame(rows)


    # --------------------------------------------------------
    # INPUT FEATURES
    # --------------------------------------------------------

    X = df[
        [
            "machine_type",
            "fault_type",
            "technician_id",
            "experience_years"
        ]
    ]


    # --------------------------------------------------------
    # TARGET
    # --------------------------------------------------------

    y = df["resolution_minutes"]


    # --------------------------------------------------------
    # CATEGORICAL FEATURES
    # --------------------------------------------------------

    categorical_features = [
        "machine_type",
        "fault_type",
        "technician_id"
    ]


    # --------------------------------------------------------
    # PREPROCESSING
    # --------------------------------------------------------

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(
                    handle_unknown="ignore"
                ),
                categorical_features
            )
        ],
        remainder="passthrough"
    )


    # --------------------------------------------------------
    # RANDOM FOREST MODEL
    # --------------------------------------------------------

    model = Pipeline(
        steps=[
            (
                "preprocessor",
                preprocessor
            ),
            (
                "regressor",
                RandomForestRegressor(
                    n_estimators=100,
                    random_state=42
                )
            )
        ]
    )


    # --------------------------------------------------------
    # TRAIN MODEL
    # --------------------------------------------------------

    model.fit(X, y)

    return model


# ============================================================
# PREDICT REPAIR TIME
# ============================================================

def predict_repair_time(
    model,
    request,
    technician,
    machine
):

    input_data = pd.DataFrame(
        [
            {
                "machine_type":
                    machine["machine_type"],

                "fault_type":
                    request["fault_type"],

                "technician_id":
                    technician["technician_id"],

                "experience_years":
                    technician["experience_years"]
            }
        ]
    )


    # --------------------------------------------------------
    # ML PREDICTION
    # --------------------------------------------------------

    prediction = model.predict(
        input_data
    )[0]


    return round(
        float(prediction),
        1
    )