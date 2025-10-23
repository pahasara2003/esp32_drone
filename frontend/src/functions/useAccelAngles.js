import { useEffect, useState } from "react";

function useAccelAngles(data) {
  const [angles, setAngles] = useState({ roll: 0, pitch: 0,yaw:0 });

  useEffect(() => {
    if (!data) return;
    

    const roll  = Math.atan2(data.ay, data.az);
    const pitch = Math.atan2(-data.ax, Math.sqrt(data.ay ** 2 + data.az ** 2));
    const yaw = data.yaw;
    setAngles({ roll: roll, pitch: pitch,yaw:yaw });
  }, [data]); // Recalculate when data changes

  return angles;
}

export default useAccelAngles;
