
// Software Requirements
const softwareCameraRequirements = {
  distances: [5, 50],    // Requires coverage from 5m to 50m
  lightLevels: [1, 1000] // Requires coverage from 1 lux to 1000 lux
};

// Hardware Cameras (various test cases)
const hardwareCameras = {
  // Test Case 1: Perfect coverage (single camera covers all)
  perfectCoverage: [
    { distances: [5, 50], lightLevels: [1, 1000] }
  ],

  // Test Case 2: Multiple cameras with overlapping ranges
  overlappingCoverage: [
    { distances: [5, 20], lightLevels: [1, 400] },
    { distances: [15, 35], lightLevels: [300, 700] },
    { distances: [30, 50], lightLevels: [600, 1000] }
  ],

  // Test Case 3: Gaps in coverage
  gapInCoverage: [
    { distances: [5, 20], lightLevels: [1, 400] },
    { distances: [25, 50], lightLevels: [500, 1000] } // Gap between 20-25m
  ],

  // Test Case 4: Coverage with many small segments
  fragmentedCoverage: [
    { distances: [5, 10], lightLevels: [1, 100] },
    { distances: [8, 15], lightLevels: [50, 200] },
    { distances: [12, 25], lightLevels: [150, 400] },
    { distances: [20, 40], lightLevels: [300, 800] },
    { distances: [35, 50], lightLevels: [700, 1000] }
  ],

  // Test Case 5: Insufficient coverage
  insufficientCoverage: [
    { distances: [5, 30], lightLevels: [1, 600] },
    { distances: [40, 50], lightLevels: [800, 1000] } // Missing 30-40m
  ],

  // Test Case 6: Edge case - empty hardware set
  emptySet: []
};

function isRangeCoveredOptimized([reqStart, reqEnd], ranges) {
  if (ranges.length === 0) return false;

  ranges.sort((a, b) => a[0] - b[0]);
  let covered = reqStart;

  for (const [start, end] of ranges) {
    if (start > covered) break;
    if (end > covered) covered = end;
    if (covered >= reqEnd) return true;
  }
  return covered >= reqEnd;
}

// independent
function isCameraSetSufficientOptimized(softwareReq, hardwareCameras) {
  const distanceCovered = isRangeCoveredOptimized(
    softwareReq.distances,
    hardwareCameras.map(c => c.distances)
  );
  return distanceCovered && isRangeCoveredOptimized(
    softwareReq.lightLevels,
    hardwareCameras.map(c => c.lightLevels)
  );
}

// combined
function isCombinedCoverageSufficient(softwareReq, hardwareSet, distanceStep = 1, lightStep = 50) {
  for (let dist = softwareReq.distances[0]; dist <= softwareReq.distances[1]; dist += distanceStep) {
    for (let light = softwareReq.lightLevels[0]; light <= softwareReq.lightLevels[1]; light += lightStep) {
      const covered = hardwareSet.some(camera =>
        dist >= camera.distances[0] && dist <= camera.distances[1] &&
        light >= camera.lightLevels[0] && light <= camera.lightLevels[1]
      );
      if (!covered) {
        return false; // Found uncovered combination
      }
    }
  }
  return true; // All combinations covered
}

function runAllTests() {
  console.log("=== Camera Coverage Test Results ===");

  const testCases = [
    { name: "Perfect Coverage", data: hardwareCameras.perfectCoverage, expected: true },
    { name: "Overlapping Coverage", data: hardwareCameras.overlappingCoverage, expected: true },
    { name: "Gap in Coverage", data: hardwareCameras.gapInCoverage, expected: false },
    { name: "Fragmented Coverage", data: hardwareCameras.fragmentedCoverage, expected: true },
    { name: "Insufficient Coverage", data: hardwareCameras.insufficientCoverage, expected: false },
    { name: "Empty Hardware Set", data: hardwareCameras.emptySet, expected: false }
  ];

  testCases.forEach((test, index) => {
    // const result = isCameraSetSufficientOptimized(
    //   softwareCameraRequirements,
    //   test.data
    // );
    const result = isCombinedCoverageSufficient(
      softwareCameraRequirements,
      test.data
    );
    const status = result === test.expected ? "PASSED" : "FAILED";
    console.log(`\nTest ${index + 1}: ${test.name}`);
    console.log(`Expected: ${test.expected}, Got: ${result}`);
    console.log(`Status: ${status}`);
  });
}

// Run all tests
runAllTests();