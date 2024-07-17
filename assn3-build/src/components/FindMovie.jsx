import { useState, useEffect } from "react";

export default function FindMovie({ onKeySubmit }) {
  const [see, setKey] = useState("");
  // useEffect(function myEffect() {
  //   console.log("myEffect was called ");
  // });

  const updateKey = (ev) => {
    console.log("Change event!");
    console.log(ev);
    setKey(ev.target.value);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    onKeySubmit(see);
    setKey("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="key"
          id="key"
          value={see}
          onChange={updateKey}
        />
        <button>Enter API key!</button>
      </form>
    </>
  );
}
