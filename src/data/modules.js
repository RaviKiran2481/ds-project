const modules = [
  {
    id: 1,
    number: '01',
    title: 'Python for Data Science',
    description:
      'Master Python fundamentals, NumPy, Pandas and core libraries used throughout the Data Science workflow.',
    topics: ['Python Basics', 'NumPy Arrays', 'Pandas DataFrames', 'Functions & File I/O'],
    materials: 5,
    experiments: 1,
    progress: 80,
  },
  {
    id: 2,
    number: '02',
    title: 'Data Collection and Preprocessing',
    description:
      'Learn how to collect datasets from multiple sources and clean them for reliable downstream analysis.',
    topics: ['Data Sources', 'Missing Values', 'Outliers', 'Feature Encoding'],
    materials: 3,
    experiments: 1,
    progress: 60,
  },
  {
    id: 3,
    number: '03',
    title: 'Exploratory Data Analysis',
    description:
      'Explore datasets statistically, discover patterns, correlations and insights before modelling.',
    topics: ['Summary Statistics', 'Correlation', 'Distributions', 'GroupBy Analysis'],
    materials: 5,
    experiments: 1,
    progress: 45,
  },
  {
    id: 4,
    number: '04',
    title: 'Data Visualization',
    description:
      'Communicate insights effectively with Matplotlib, Seaborn and interactive Plotly charts.',
    topics: ['Matplotlib', 'Seaborn', 'Plotly', 'Chart Selection'],
    materials: 0,
    experiments: 1,
    progress: 30,
  },
  {
    id: 5,
    number: '05',
    title: 'Machine Learning',
    description:
      'Build, train and evaluate supervised and unsupervised machine learning models with Scikit-learn.',
    topics: ['Regression', 'Classification', 'Clustering', 'Model Evaluation'],
    materials: 8,
    experiments: 1,
    progress: 15,
  },
]

export default modules
