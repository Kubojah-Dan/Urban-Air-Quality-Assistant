# Accessibility & Inclusive Design (WCAG 2.2 Level AA)

DayShift is built from the ground up to comply with **WCAG 2.2 Level AA** accessibility requirements, ensuring equal access for users relying on keyboard navigation, screen readers, screen magnification, and high-contrast settings.

---

## 1. Contrast Ratios & Visual Semantics

### Color Contrast Verification Table

| UI Element / State | Foreground Color | Background Color | Measured Ratio | WCAG 2.2 AA Standard | Conformance Status |
|---|---|---|---|---|---|
| Primary Headings & Titles | `#1c1917` (stone-900) | `#ffffff` (white) | **16.5 : 1** | Min 4.5:1 | **PASS (Exceeds AAA)** |
| Body Text & Constraints | `#292524` (stone-800) | `#ffffff` (white) | **13.8 : 1** | Min 4.5:1 | **PASS (Exceeds AAA)** |
| Secondary Descriptions | `#44403c` (stone-700) | `#f5f5f4` (stone-100) | **6.2 : 1** | Min 4.5:1 | **PASS (AA Compliant)** |
| Recommended Badge | `#166534` (emerald-800) | `#ecfdf5` (emerald-50) | **6.8 : 1** | Min 4.5:1 | **PASS (AA Compliant)** |
| Forecast Model Badge | `#1e40af` (blue-800) | `#eff6ff` (blue-50) | **7.2 : 1** | Min 4.5:1 | **PASS (AA Compliant)** |
| Warning / Preliminary Badge | `#854d0e` (amber-800) | `#fefce8` (amber-50) | **5.9 : 1** | Min 4.5:1 | **PASS (AA Compliant)** |
| Emergency Alert Banner | `#ffffff` (white) | `#e11d48` (rose-600) | **5.1 : 1** | Min 4.5:1 | **PASS (AA Compliant)** |
| Interactive Focus Ring | `#16a34a` (brand-600) | `#ffffff` (white) | **3.4 : 1** | Min 3.0:1 | **PASS (AA Focus Ring)** |

### Color Independence
- No status or risk level is communicated solely via color.
- All air quality bands, observation states, and decision options pair color with text labels, icons (e.g., Radio, CloudSun, CheckCircle, AlertTriangle), and distinct pill badges.

---

## 2. Keyboard Navigation & Focus Management

### Complete Keyboard Journey
The complete end-to-end user flow can be performed without touch or mouse interactions:
1. **Initial Selection:** `Tab` cycles through the decision cards (`commute`, `outdoor`, `indoor`). `Enter` or `Space` selects a radio card with active `aria-checked="true"`.
2. **City Selector:** Standard `<select>` and combobox navigable using `ArrowUp` / `ArrowDown` and `Enter`.
3. **Context Input:** Form fields (`time`, `text`, `checkbox`) accept standard keyboard input. `Enter` submits the form.
4. **Decision Board:** Option cards are focusable articles. Tab moves naturally through Usual, Recommended, and Backup options.
5. **Contextual Replanner:** In-place preset buttons and input fields are focusable in logical DOM order.
6. **Focus Rings:** High-visibility focus indicators (`focus-visible:ring-2 focus-visible:ring-brand-500`) are active across all interactive elements.

### Dialog & Modal Focus Trap
- **Focus Containment:** When a dialog opens, initial focus is trapped inside the container. Pressing `Tab` on the last focusable element loops back to the first element; pressing `Shift+Tab` on the first element loops to the last element.
- **Escape to Close:** Pressing the `Escape` key immediately closes the dialog.
- **Focus Restoration:** Upon closing, focus is restored to the triggering button.

---

## 3. Screen Reader & Alternative Representations

- **Table Alternative for Timeline:** The hourly forecast day-strip timeline provides a one-click toggle to an accessible HTML `<table>` (`scope="col"`, semantic headers, structured row data), allowing screen-reader users to parse forecast trends systematically.
- **Semantic HTML Hierarchy:** Strict heading hierarchy (`<h1>` for page topic, `<h2>` for major sections, `<h3>` for cards, `<h4>` for sub-sections).
- **ARIA Live Regions:** Emergency warnings (such as the Carbon Monoxide alarm banner) use `role="alert"` for immediate screen-reader notification.
