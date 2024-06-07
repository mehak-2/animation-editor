import React, { useState, useEffect } from 'react';

const KeyframeSlider = ({ handlePartitionClick, selectedElement }) => {
  const [selectedPartition, setSelectedPartition] = useState(null);
  const [keyframes, setKeyframes] = useState([]);

  useEffect(() => {
    const storedKeyframes = JSON.parse(localStorage.getItem(selectedElement?.name)) || [];
    setKeyframes(Array.isArray(storedKeyframes) ? storedKeyframes : []);
  }, [selectedElement]);

  const handlePartitionSelection = (percent) => {
    setSelectedPartition(percent);
  };

  const handleAddCss = () => {
    const newKeyframes = [...keyframes, { partition: selectedPartition, cssData: {} }];
    setKeyframes(newKeyframes);
    localStorage.setItem(selectedElement.name, JSON.stringify(newKeyframes));
    handlePartitionClick(selectedPartition);
  };

  const isCssAdded = (percent) => {
    return keyframes.some(frame => frame.partition === percent && Object.keys(frame.cssData).length > 0);
  };

  return (
    <div className="keyframe-slider">
      <div className="partitions-container">
        {[...Array(101).keys()].map((percent) => (
          <div
            className={`partition ${selectedPartition === percent ? 'selected' : ''} ${isCssAdded(percent) ? 'css-added' : ''}`}
            key={percent}
            onClick={() => handlePartitionSelection(percent)}
          >
            {selectedPartition === percent && (
              <div className="popup">
                {Array.isArray(keyframes) &&
                  keyframes
                    .filter(frame => frame && frame.partition === selectedPartition)
                    .map((frame, index) => (
                      <div key={index}>
                        {Object.entries(frame.cssData).map(([property, value]) => (
                          <p key={property}>{`${property}: ${value}`}</p>
                        ))}
                      </div>
                    ))}
                <button className="css-btn" onClick={handleAddCss}>Add CSS</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyframeSlider;
