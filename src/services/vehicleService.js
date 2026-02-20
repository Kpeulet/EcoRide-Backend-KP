import Vehicle from "../models/Vehicle.js";

/* -------------------------------------------------------
   🟢 CRÉER UN VÉHICULE (DRIVER)
------------------------------------------------------- */
export const createVehicle = async (driverId, data) => {
  return await Vehicle.create({
    driver: driverId,
    ...data,
  });
};

/* -------------------------------------------------------
   🟢 RÉCUPÉRER LE VÉHICULE D’UN CONDUCTEUR
------------------------------------------------------- */
export const getVehicleByDriver = async (driverId) => {
  return await Vehicle.findOne({ driver: driverId });
};

/* -------------------------------------------------------
   🟢 METTRE À JOUR LE VÉHICULE D’UN CONDUCTEUR
------------------------------------------------------- */
export const updateVehicle = async (driverId, data) => {
  return await Vehicle.findOneAndUpdate(
    { driver: driverId },
    data,
    { new: true, runValidators: true }
  );
};

/* -------------------------------------------------------
   🟢 SUPPRIMER LE VÉHICULE D’UN CONDUCTEUR
------------------------------------------------------- */
export const deleteVehicle = async (driverId) => {
  return await Vehicle.findOneAndDelete({ driver: driverId });
};

/* -------------------------------------------------------
   🟢 RÉCUPÉRER TOUS LES VÉHICULES (ADMIN)
------------------------------------------------------- */
export const getAllVehicles = async () => {
  return await Vehicle.find().populate("driver", "firstname lastname email");
};
