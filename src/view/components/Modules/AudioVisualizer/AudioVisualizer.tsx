import { useEffect, useRef, useState } from "react";
import { VisualizerModule } from "models";

interface AudioVisualizerProps {
  onMount: (module: VisualizerModule) => void;
  frequency?: number;
  className?: string;
}
export function AudioVisualizer(props: AudioVisualizerProps) {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [visualizer, setVisualizer] = useState<VisualizerModule | null>();

  const { onMount, className, frequency } = props;

  useEffect(() => {
    if (onMount && visualizer) onMount(visualizer);
  }, [onMount, visualizer]);

  useEffect(() => {
    if (!frequency || !visualizer) return;
    visualizer.setPeriod(frequency);
  }, [visualizer, frequency]);

  useEffect(() => {
    if (!canvasContainer.current) return;
    const vis = new VisualizerModule(canvasContainer.current);
    setVisualizer(vis);
    return () => {
      setVisualizer(null);
    };
  }, []);

  return (
    <div
      ref={canvasContainer}
      className={className}
      style={{
        display: "flex",
        backgroundColor: className ? "" : "black",
        color: className ? "" : "white",
        width: className ? "" : "100%",
        height: className ? "" : "100%",
      }}
    ></div>
  );
}
