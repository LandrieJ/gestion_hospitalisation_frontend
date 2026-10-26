import { useContext } from "react";
import { UserContext } from "../../utils/UserContext";
import { PaHospital } from "./persnnel_admin_Hospital";
import { SaHospital } from "./super_admin_Hospital";

export const Hospital = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      {user && user.user_type === "super_admin" ? (
        <SaHospital />
      ) : (
        <PaHospital user={user}  />
      )}
    </>
  );
};