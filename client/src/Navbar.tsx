import styles from "./Navbar.module.css";
import { useData } from "./context";

export const Navbar = () => {
  const { connected, user } = useData();
  return (
    <div className={styles.container}>



      <h1>Todo app</h1>


      {user?.displayName && <h3>{user?.displayName}</h3>}


      {user?.photoURL && <img className={styles.image} src={user?.photoURL} />}



      <div
        className={styles.circle}
        style={
          connected ? { backgroundColor: "green" } : { backgroundColor: "red" }
        }
      />



    </div>
  );
};
