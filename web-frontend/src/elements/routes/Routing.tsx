import { Routes, Route } from "react-router-dom";
import routes from "../../constants/routes";
import UserInterface from "./UserInterface";

function Routing() {
  return (
    <Routes>
      {Object.values(routes).map((route) => (
        <Route
          key={"routing-key-" + route.id}
          path={route.path}
          element={<UserInterface body={<route.component />} />}
        />
      ))}
    </Routes>
  );
}

export default Routing;
