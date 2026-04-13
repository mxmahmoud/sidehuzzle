# Project Context & Chat History Summary
**Purpose:** This document summarizes the entire conversation history, instructions, and architectural decisions made so far. It is intended to be used with Claude Code to review the current state of the project, identify gaps between the user's intention and the generated output, and realign the development direction.

---

## 1. Initial Goal & Intention
**User's Original Request:**
The user provided a directory of 31 UI flow chart screenshots (`@ui_flow_charts/`) for a marketplace application (connecting customers posting jobs with freelancers offering services, similar to TaskRabbit/Airbnb). 
The goal was to act as a requirements engineer and extract a Single Source of Truth (SSOT) JSON specification that documents:
- All pages/screens and their layouts
- All UI elements and interactions
- All user flows (reconstructed from the diagrams)
- All shared/global components

**Constraints & Principles:**
- The JSON must be stable, structured, and extensible (using `snake_case` IDs).
- It must serve as the foundation for both the React Native frontend and FastAPI backend.
- It must be exhaustive, inferring implicit behaviors (dragging, filtering) while maintaining a strict JSON format.

**Action Taken:**
The AI created a Python script (`scripts/build_ui_ssot.py`) to programmatically generate `product_ui_ssot.json`. This resulted in a spec with 61 pages and 26 flows.

---

## 2. UX Refinement: Map & List Discovery (Airbnb/Uber Style)
**User's Instruction:**
The user wanted to ensure the discovery experience was highly interactive, modern, and appealing, specifically citing Airbnb, Booking.com, and Uber. 
Key requirements:
- A seamless map and list view.
- Hovering over a post in the list should highlight the corresponding pin on the map.
- Clicking a pin should highlight the post in the list (if both are visible).
- On mobile, it should intelligently jump to the job/profile description or use a bottom sheet, avoiding overwhelming the user.
- Allow a list-only view for users who prefer it.

**Action Taken:**
The AI updated the SSOT generator to include a `discovery_map_list_ux` contract. This added:
- **View Modes:** Split view (desktop/tablet), Map-first (with bottom sheet), and List-only.
- **Selection Sync:** Shared state between map pins and list cards.
- **Responsive Behavior:** Rules for when to show split views vs. single-pane navigation.
- **Visual & Motion Systems:** Specifications for premium UI, loading skeletons, and snap-point animations for bottom sheets.

---

## 3. Technical Foundation & Architecture (React Native 0.89.x & Boilerplates)
**User's Instruction:**
The user asked to revise the SSOT to ensure it utilizes features from React Native 0.89.x (the latest/upcoming architecture) and asked whether the project should reference a boilerplate like Ignite or Tailwind (NativeWind).

**AI's Recommendation & Action Taken:**
The AI clarified that RN 0.89 doesn't strictly exist yet, but the focus should be on the **New Architecture** (Fabric/TurboModules) which is default in Expo SDK 52+. 
The AI advised *against* forcing a heavy boilerplate or making Tailwind the core architecture, instead recommending a **thin, custom Expo foundation** tailored for a premium, map-heavy app.

The SSOT was updated to include an `implementation_foundation` block with the following strict recommendations:
- **Runtime:** Expo-first, New Architecture only.
- **Navigation:** Expo Router (file-based routing maps cleanly to SSOT page IDs).
- **State Management:** TanStack Query (server state), Zustand (client UI state), React Hook Form (forms).
- **Styling:** Design tokens + component primitives (NativeWind is optional, but semantic tokens are required).
- **Gestures & Motion:** `react-native-gesture-handler`, `react-native-reanimated`, `@gorhom/bottom-sheet`.
- **Lists & Performance:** `FlashList` (crucial for large feeds and map sync).
- **Backend:** FastAPI with typed contracts aligned to the SSOT.

---

## 4. Current State & User Dissatisfaction
**Current Output:**
- `scripts/build_ui_ssot.py` (Generator script, currently at schema version 1.3.0)
- `product_ui_ssot.json` (The generated SSOT file)

**User's Sentiment:**
The user is **not satisfied** with the current state of the output. Despite the AI adding UX contracts and implementation foundations to the JSON, the user feels there is a disconnect between their vision for a "modern, interactive, very appealing, and easy to use" application and what has been produced or structured so far.

**Next Steps for Claude Code:**
Use this document to review the `product_ui_ssot.json` and `scripts/build_ui_ssot.py`. 
Evaluate whether the current JSON structure is actually useful for scaffolding a premium React Native app, or if the abstraction has become too dense/misaligned with practical frontend development. Realignment is needed to ensure the SSOT directly translates into the elegant, Airbnb-quality UI the user desires.

---
### Appendix: User's Original Prompt for Context
```text
Analyze all images in @ui_flow_charts/ for following:
- Page structure
- ui/interaction flow
- features

Write it down in a json format. 

Example:
'''
{
'Pages': {
"login_page":  {'description': '....', interactive_elements: ['...', '...'], features: [' ...', '...'], interaction_with_elements_lead_to: ['login_btn->page_key', 'register_btn->page_key', 'return_btn->page_key', 'click_burger->menu becomes visible', etc...]},
"profile_page": {'description': ......},
.....},
'flow': {
'register account': {description: '', flow: {0: [' ', '  ',], 1:[' ', ' ', ' ']....}}
'create_job': {description: '', flow: {0: ['', '  ',], 1:[' ', ' ', ' ']....}}
}
}
'''

Assume that most of the images are resembling one interaction flow a long the row, but sometimes it is splitted in several rows due to different possible interactions. Nonetheless, i need you to write in a descriptive manner, all what you see for each image, like a requirements engineer, who is trying to tell an entire team what the app should look like and what it should do, in very detailed manner. the flowcharts are just simple boxes and text etc. just for conceptual communication. the goal is to achieve a modernly and elegant designed app.
```