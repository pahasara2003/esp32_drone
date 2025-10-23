import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import useAccelAngles from "./functions/useAccelAngles";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";

const toDegrees = (rad) => rad * (180 / Math.PI);

function Model({ angles }) {
  const ref = useRef();
  const { scene } = useGLTF("drone_low_poly.glb");

  const clonedScene = useMemo(() => clone(scene), [scene]);

  useFrame(() => {
    ref.current.rotation.z = angles.roll;
    ref.current.rotation.x = angles.pitch;
        ref.current.rotation.y = angles.yaw;

  });

  return (
    <primitive
      ref={ref}
      object={clonedScene}
      scale={0.03}
      rotation={[0, 0, 0]}
      
    />
  );
}

function App() {
  const [data, setData] = useState(null);
  const angles = useAccelAngles(data);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => console.log("✅ Connected to WebSocket");
    ws.onclose = () => console.log("❌ Disconnected");

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        setData(json);
      } catch {
        console.error("Invalid JSON:", event.data);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="wrapper">
      <div className="wrapper row">
        <table className="ax">
          <tr>
            <th colSpan={3}>
              Acceleration (ms<sup>-2</sup>)
            </th>
          </tr>
          <tr>
            <th>x</th>
            <th>y</th>
            <th>z</th>
          </tr>
          <tr>
            <td>{data?.ax.toFixed(3)} </td>
            <td>{data?.ay.toFixed(3)}</td>
            <td>{data?.az.toFixed(3)} </td>
          </tr>
        </table>
        <table className="grid-1">
          {data ? (
            <>
              <tr>
                <th>Roll</th>
                <th>Pitch</th>
                <th>Yaw</th>
              </tr>
              <tr>
                <td>{toDegrees(angles.roll).toFixed(1)}°</td>
                <td>{toDegrees(angles.pitch).toFixed(1)}°</td>
                <td>{toDegrees(angles.yaw).toFixed(1)}°</td>
              </tr>
            </>
          ) : (
            <>
              <tr>
                <th>Roll</th>
                <th>Pitch</th>
                <th>Yaw</th>
              </tr>
              <tr>
                {" "}
                <td>N/A</td>
                <td>N/A</td>
              </tr>
            </>
          )}
        </table>
        <table className="ax">
          <tr>
            <th colSpan={3}>
              Angular Velocity (rads<sup>-1</sup>)
            </th>
          </tr>
          <tr>
            <th>x</th>
            <th>y</th>
            <th>z</th>
          </tr>
          <tr>
            <td>{data?.gx.toFixed(3)} </td>
            <td>{data?.gy.toFixed(3)}</td>
            <td>{data?.gz.toFixed(3)} </td>
          </tr>
        </table>
      </div>
      <div className="canvas-container">
        <div className="canvas">
          <Canvas camera={{ position: [0, 0, 7], fov: 30 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Model angles={angles}  />
            
            <axesHelper args={[4]} /> {/* size 2 units */}
          </Canvas>
          <h1>POW</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
