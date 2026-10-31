---
title: Parametric Part Modeling
summary: Solid parts built from fully defined sketches, so a single dimension change updates the whole model.
competencies: [thinking-making, data-management]
outcomes: [parametric-modeling]
skills:
  - Fully defined sketches with dimensions and geometric relations
  - Extruded boss/base and extruded cut features
  - Revolved features for round parts
  - Circular and linear patterns
  - Fillets, chamfers, and through holes
  - Choosing the right sketch plane and base feature
projects:
  - cad111/models/pressure-plate
  - cad111/models/part1
  - cad111/models/a1005
  - cad111/models/cad111-0004
  - cad111/models/cad111-0005
  - cad111/models/cad111-0006
order: 1
---

Every part in this group starts as a 2D sketch that is **fully defined**: each line and arc is locked down by a dimension or a geometric relation such as horizontal, tangent, or concentric. From there I build the part feature by feature, using extrusions, cuts, revolves, and patterns. Because the model is parametric, changing one value (a plate thickness, a hole diameter, the number of slots) rebuilds everything that depends on it instead of breaking the part.

Symmetry does a lot of the work in round parts. The Pressure Plate's six hollow bosses and the four slots in the arbor press's Slotted Disc are evenly spaced around a center axis, so their layout has to stay even when the part changes. The brackets and the crank arm needed more planning up front: choosing which profile becomes the base feature and which sketch plane it sits on decides how easily the part can change later.

**Why it matters on the job:** in industry, a model is rarely finished the first time. Customers change requirements, and suppliers change stock sizes. A model with clear design intent can be revised in minutes and its dimensions trusted. That makes it the starting point for prototypes, drawings, and manufacturing data. This is the core of thinking and making creatively: turning an idea into a model that can be tested and improved.
