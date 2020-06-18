import {
  overviewDisplayTemplate,
  academicsDisplayTemplate,
  studentLifeDisplayTemplate,
  financialDisplayTemplate,
} from "../../lib";

// define tab numbers to subsection content
const sectionTabs = {
  0: overviewDisplayTemplate(),
  1: academicsDisplayTemplate(),
  2: studentLifeDisplayTemplate(),
  3: financialDisplayTemplate(),
};

export function displaySubsection(currentTab) {
  const subsectionDisplay = document.querySelector(".modal__section-facts");
  /* 

    Need to handle the alternate queries here

  */
  subsectionDisplay.innerHTML = sectionTabs[currentTab];
}