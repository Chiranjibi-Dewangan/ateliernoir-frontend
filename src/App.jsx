import { useEffect, useState } from "react";
import DetailPanel from "./components/DetailPanel";
import GuidedMode from "./components/GuidedMode";
import Header from "./components/Header";
import Legend from "./components/Legend";
import MobileDrawer from "./components/MobileDrawer";
import SectionIndex from "./components/SectionIndex";
import Wheel from "./components/Wheel";
import { glossary, guidedSteps, legendItems, nodeMap, nodes } from "./data/bhavachakra";

const overviewIds = ["hub", "karma-ring", "realms-ring", "nidanas-ring", "frame"];
const highlightedIndexIds = [
  "gods",
  "humans",
  "hungry-ghosts",
  "hell-realm",
  "eight-hot-hells",
  "eight-cold-hells",
  "amitabha-pureland",
  "shakyamuni-buddha",
];

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [guidedMode, setGuidedMode] = useState(false);
  const [guidedIndex, setGuidedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedId(null);
        setGuidedMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleClear = () => {
    setSelectedId(null);
  };

  const startGuidedMode = () => {
    setGuidedMode(true);
    setGuidedIndex(0);
    setSelectedId(guidedSteps[0].nodeId);
  };

  const moveGuided = (direction) => {
    const nextIndex = Math.min(Math.max(guidedIndex + direction, 0), guidedSteps.length - 1);
    setGuidedIndex(nextIndex);
    setSelectedId(guidedSteps[nextIndex].nodeId);
  };

  const stopGuidedMode = () => {
    setGuidedMode(false);
    setSelectedId(null);
  };

  const selectedNode = selectedId ? nodeMap[selectedId] : null;
  const relatedNodes = selectedNode ? selectedNode.relatedIds.map((id) => nodeMap[id]).filter(Boolean) : [];
  const glossaryItems = selectedNode
    ? glossary.filter((item) => {
        const note = `${selectedNode.glossaryNote} ${selectedNode.longDescription}`.toLowerCase();
        return note.includes(item.term.toLowerCase()) || note.includes(item.id.replaceAll("-", " "));
      })
    : glossary.slice(0, 3);

  const indexGroups = [
    {
      title: "Main structure",
      items: overviewIds.map((id) => nodeMap[id]),
    },
    {
      title: "Key regions",
      items: highlightedIndexIds.map((id) => nodeMap[id]),
    },
  ];

  return (
    <div className="app-shell">
      <div className="page-aura" aria-hidden="true" />

      <Header />

      <main className="workspace">
        <section className="wheel-column">
          <GuidedMode
            guidedSteps={guidedSteps}
            active={guidedMode}
            currentIndex={guidedIndex}
            onStart={startGuidedMode}
            onNext={() => moveGuided(1)}
            onPrevious={() => moveGuided(-1)}
            onExit={stopGuidedMode}
          />

          <Wheel nodes={nodes} nodeMap={nodeMap} selectedId={selectedId} onSelect={handleSelect} onClear={handleClear} />

          <Legend items={legendItems} />

          <SectionIndex groups={indexGroups} onSelect={handleSelect} />
        </section>

        <aside className="detail-column">
          <DetailPanel
            node={selectedNode}
            relatedNodes={relatedNodes}
            glossaryItems={glossaryItems}
            onSelect={handleSelect}
            onClear={handleClear}
            onStartGuided={startGuidedMode}
          />
        </aside>
      </main>

      <MobileDrawer>
        <DetailPanel
          node={selectedNode}
          relatedNodes={relatedNodes}
          glossaryItems={glossaryItems}
          onSelect={handleSelect}
          onClear={handleClear}
          onStartGuided={startGuidedMode}
        />
      </MobileDrawer>
    </div>
  );
}

export default App;
