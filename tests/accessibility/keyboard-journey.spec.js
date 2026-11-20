// Playwright accessibility specification
// Verifies keyboard navigation: Tab, Shift+Tab, Enter, Space across decision board
export const keyboardJourneySpec = {
  description: 'Proves complete keyboard navigation without mouse reliance',
  steps: [
    'Focus on start decision cards using Tab',
    'Select commute decision using Space / Enter',
    'Fill routine constraints using Tab',
    'Navigate 3-way decision board using Tab and Arrow keys'
  ]
};
