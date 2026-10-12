// Study materials loaded from DS PPT (converted to book pages; PDFs embedded directly).
const materials = [
  { id: 'm1', title: 'Data Analysis and Analytics', module: 3, pages: 10, view: 'book', flip: 'Data_Analysis_and_Analytics' },
  { id: 'm2', title: 'Data Collection and Data Pre-Processing', module: 2, pages: 12, view: 'book', flip: 'Data_Collection_and_Data_Pre-Processing' },
  { id: 'm3', title: 'Data Processing', module: 2, pages: 48, view: 'book', flip: 'Data_Processing' },
  { id: 'm4', title: 'Data Types, Lifecycle and Applications', module: 2, pages: 10, view: 'book', flip: 'Data_Types-lifecycle-and-applications' },
  { id: 'm5', title: 'Decision Tree', module: 5, pages: 27, view: 'book', flip: 'Decision_Tree' },
  { id: 'm6', title: 'Decision Tree Classification Algorithm', module: 5, pages: 15, view: 'book', flip: 'Decision_Tree_Classification_Algorithm' },
  { id: 'm7', title: 'Descriptive Analysis', module: 3, pages: 15, view: 'book', flip: 'Descriptive_Analysis' },
  { id: 'm8', title: 'Diagnostic Analytics', module: 3, pages: 10, view: 'book', flip: 'Diagnostic_Analytics' },
  { id: 'm9', title: 'Exploratory Data Analysis', module: 3, pages: 35, view: 'book', flip: 'Exploratory_Data_Analys' },
  { id: 'm10', title: 'Feature Selection', module: 5, pages: 11, view: 'book', flip: 'Feature_Selection' },
  { id: 'm11', title: 'Introduction to Data Science', module: 1, pages: 62, view: 'book', flip: 'Introduction_to_Data_Science' },
  { id: 'm12', title: 'Introduction to Data Science (2)', module: 1, pages: 34, view: 'book', flip: 'Introduction_to_Data_Science_1' },
  { id: 'm13', title: 'Mechanistic Analysis', module: 3, pages: 29, view: 'book', flip: 'Mechanistic_Analysis' },
  { id: 'm14', title: 'Predictive Analytics', module: 5, pages: 11, view: 'book', flip: 'Predictive_Analytics' },
  { id: 'm15', title: 'Prescriptive Analytics', module: 5, pages: 9, view: 'book', flip: 'Prescriptive_Analytics' },
  { id: 'm16', title: 'Skills for Data Science', module: 1, pages: 10, view: 'book', flip: 'Skills_for_data_science' },
  { id: 'm17', title: 'Decision Trees (Storey)', module: 5, pages: 38, view: 'book', flip: 'Storey_DecisionTrees' },
  { id: 'm18', title: 'Tools for Data Science', module: 1, pages: 4, view: 'book', flip: 'Tools_For_Data_Science' },
  { id: 'm19', title: 'Tools for Data Science (2)', module: 1, pages: 92, view: 'book', flip: 'Tools_For_Data_Science_-_1' },
  { id: 'm20', title: 'User Retention', module: 5, pages: 11, view: 'book', flip: 'User_Retention' },
  { id: 'm21', title: 'Dimensionality Reduction: PCA & LDA', module: 5, pages: 4, file: '/materials/Dimensionality_PCA_LDA.pdf' },
]

export default materials
