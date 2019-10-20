import { useEffect, useState, useCallback } from "react";
import firebase from "../firebase/firebase";

export const useColorListener = user => {
  const [userColors, setUserColors] = useState([]);
  const [usersRef] = useState(firebase.database().ref("users"));

  const addColorListener = useCallback(
    userId => {
      usersRef.child(`${userId}/colors`).on("child_added", snapshot => {
        setUserColors(prevState => [snapshot.val(), ...prevState]);
      });
    },
    [usersRef]
  );

  useEffect(() => {
    if (user) {
      addColorListener(user.uid);
    }
    return () => usersRef.off();
  }, [user, usersRef, addColorListener]);

  return [userColors];
};
