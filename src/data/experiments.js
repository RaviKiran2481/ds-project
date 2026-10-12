// Structured experiment data. Edit content here — components read from this only.

const mk = (id, title, aim, code, output, module_) => ({
  id,
  title,
  aim,
  procedure: [
    'Open Jupyter Notebook or your Python editor.',
    'Import the required libraries and load the dataset.',
    `Implement the steps for ${title}.`,
    'Run the code, verify the result and record the output.',
  ],
  code,
  output,
  module: module_,
})

const experiments = [
  {
    id: 1,
    number: '01',
    title: 'Python Data Analysis',
    description:
      'Learn Python techniques for loading, manipulating, analyzing and visualizing real-world datasets.',
    module: 'Python for Data Science',
    difficulty: 'Beginner',
    tools: ['Python', 'Pandas', 'NumPy'],
    overview: {
      summary:
        'This experiment introduces loading datasets with Pandas, performing basic numerical operations with NumPy, cleaning data and producing summary statistics.',
      architecture: ['Dataset', 'Data Collection', 'Data Preprocessing', 'Data Cleaning', 'Exploratory Data Analysis', 'Visualization', 'Model / Analysis', 'Evaluation', 'Final Output'],
    },
    subExperiments: [
      mk('A', 'Data Collection', 'To load a CSV dataset into a Pandas DataFrame and inspect its structure.', `import pandas as pd

df = pd.read_csv("students.csv")
print(df.head())
print(df.info())`, `   Name  Age  Score
0 Rahul   20     85
1  Anu     21     91
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 3 entries`, 'Python for Data Science'),
      mk('B', 'Data Cleaning', 'To remove missing values and duplicates from the dataset.', `df = df.dropna()
df = df.drop_duplicates()
print(df.shape)`, `(3, 3)`, 'Python for Data Science'),
      mk('C', 'Exploratory Data Analysis', 'To compute summary statistics of the dataset.', `print(df.describe())
print(df['Score'].mean())`, `             Age      Score
mean   20.333333  88.000000
88.0`, 'Python for Data Science'),
      mk('D', 'Data Visualization', 'To plot the score distribution using Matplotlib.', `import matplotlib.pyplot as plt

plt.bar(df['Name'], df['Score'])
plt.show()`, `[Bar chart rendered: Scores of Rahul, Anu, John]`, 'Python for Data Science'),
      mk('E', 'Model Building', 'To fit a simple linear regression model on the data.', `from sklearn.linear_model import LinearRegression

X = df[['Age']]
y = df['Score']
LinearRegression().fit(X, y)
print('Model fitted')`, `Model fitted`, 'Python for Data Science'),
      mk('F', 'Result Analysis', 'To interpret and summarize the findings of the analysis.', `print('Average score:', df['Score'].mean())
print('Top scorer:', df.loc[df['Score'].idxmax(), 'Name'])`, `Average score: 88.0
Top scorer: Anu`, 'Python for Data Science'),
    ],
  },
  {
    id: 2,
    number: '02',
    title: 'Data Cleaning using Pandas',
    description:
      'Handle missing values, duplicates, outliers and inconsistent formats in raw datasets effectively.',
    module: 'Data Collection and Preprocessing',
    difficulty: 'Beginner',
    tools: ['Pandas', 'NumPy'],
    overview: {
      summary:
        'This experiment covers practical data cleaning: filling missing values, dropping duplicates, detecting outliers and standardizing text fields.',
      architecture: ['Raw Dataset', 'Missing Value Check', 'Imputation', 'Deduplication', 'Outlier Handling', 'Format Standardization', 'Validation', 'Clean Dataset'],
    },
    subExperiments: [
      mk('A', 'Data Collection', 'To import a raw dataset containing quality issues.', `import pandas as pd
df = pd.read_csv("raw_data.csv")
print(df.isna().sum())`, `Age      2
Score    1
dtype: int64`, 'Data Collection and Preprocessing'),
      mk('B', 'Data Cleaning', 'To fill missing values and remove duplicate rows.', `df['Age'] = df['Age'].fillna(df['Age'].mean())
df = df.drop_duplicates()
print(df.isna().sum().sum())`, `0`, 'Data Collection and Preprocessing'),
      mk('C', 'Exploratory Data Analysis', 'To identify outliers using the IQR rule.', `Q1 = df['Score'].quantile(0.25)
Q3 = df['Score'].quantile(0.75)
print('Outliers beyond', Q3 + 1.5 * (Q3 - Q1))`, `Outliers beyond 118.5`, 'Data Collection and Preprocessing'),
      mk('D', 'Data Visualization', 'To visualize missing data before and after cleaning.', `import matplotlib.pyplot as plt
plt.bar(['Before', 'After'], [3, 0])
plt.show()`, `[Bar chart rendered: 3 missing before, 0 after]`, 'Data Collection and Preprocessing'),
      mk('E', 'Model Building', 'To encode categorical columns for modeling readiness.', `df_encoded = pd.get_dummies(df, columns=['Branch'])
print(df_encoded.head())`, `   Age  Score  Branch_DS
0   20     85          1`, 'Data Collection and Preprocessing'),
      mk('F', 'Result Analysis', 'To validate the cleaned dataset and export it.', `print(df.shape)
df.to_csv('clean_data.csv', index=False)`, `(120, 4)`, 'Data Collection and Preprocessing'),
    ],
  },
  {
    id: 3,
    number: '03',
    title: 'Exploratory Data Analysis',
    description:
      'Discover patterns, correlations and distributions using statistical summaries and groupby analysis.',
    module: 'Exploratory Data Analysis',
    difficulty: 'Intermediate',
    tools: ['Pandas', 'Matplotlib', 'Seaborn'],
    overview: {
      summary:
        'EDA experiment on statistical summaries, correlation analysis, distribution plots and group-by aggregations to find insights.',
      architecture: ['Dataset', 'Summary Statistics', 'Correlation', 'Distributions', 'GroupBy', 'Hypothesis', 'Insight Report'],
    },
    subExperiments: [
      mk('A', 'Data Collection', 'To load the survey dataset for exploration.', `import pandas as pd
df = pd.read_csv("survey.csv")
print(df.head(3))`, `   Age   Score   Hours
0   20      85      5
1   21      91      7`, 'Exploratory Data Analysis'),
      mk('B', 'Data Cleaning', 'To drop null rows and correct data types.', `df = df.dropna()
df['Age'] = df['Age'].astype(int)
print(df.dtypes)`, `Age      int64
Score   float64
Hours    int64`, 'Exploratory Data Analysis'),
      mk('C', 'Exploratory Data Analysis', 'To compute correlation between study hours and score.', `print(df.corr(numeric_only=True))`, `             Age  Score  Hours
Age       1.00   0.42   0.60
Score     0.42   1.00   0.78
Hours     0.60   0.78   1.00`, 'Exploratory Data Analysis'),
      mk('D', 'Data Visualization', 'To plot a histogram of the score distribution.', `import matplotlib.pyplot as plt
plt.hist(df['Score'], bins=10)
plt.show()`, `[Histogram rendered: score frequencies]`, 'Exploratory Data Analysis'),
      mk('E', 'Model Building', 'To test a simple hypothesis using mean comparison.', `high = df[df['Hours'] >= 6]['Score'].mean()
low = df[df['Hours'] < 6]['Score'].mean()
print(high, low)`, `88.4 71.2`, 'Exploratory Data Analysis'),
      mk('F', 'Result Analysis', 'To write down the key insights from the exploration.', `print('Students studying 6+ hours score', round(high - low, 1), 'marks higher on average')`, `Students studying 6+ hours score 17.2 marks higher on average`, 'Exploratory Data Analysis'),
    ],
  },
  {
    id: 4,
    number: '04',
    title: 'Data Visualization',
    description:
      'Create insightful line, bar, scatter and heatmap charts with Matplotlib and Seaborn.',
    module: 'Data Visualization',
    difficulty: 'Intermediate',
    tools: ['Matplotlib', 'Seaborn', 'Plotly'],
    overview: {
      summary:
        'Learn chart selection and styling: line charts for trends, bar charts for categories, scatter plots for relationships and heatmaps for correlations.',
      architecture: ['Dataset', 'Chart Selection', 'Styling', 'Annotation', 'Comparison', 'Interactive Chart', 'Report Export'],
    },
    subExperiments: [
      mk('A', 'Data Collection', 'To load the monthly sales dataset.', `import pandas as pd
df = pd.read_csv("sales.csv")
print(df.head())`, `   Month  Sales
0   Jan    120
1   Feb    150`, 'Data Visualization'),
      mk('B', 'Data Cleaning', 'To ensure the month column is in order.', `months = ['Jan','Feb','Mar','Apr']
df['Month'] = pd.Categorical(df['Month'], categories=months, ordered=True)
df = df.sort_values('Month')`, `Sorted 4 rows by Month`, 'Data Visualization'),
      mk('C', 'Exploratory Data Analysis', 'To find the best and worst performing month.', `print(df.loc[df['Sales'].idxmax()])
print(df.loc[df['Sales'].idxmin()])`, `Apr 210
Jan 120`, 'Data Visualization'),
      mk('D', 'Data Visualization', 'To render a styled line chart with Seaborn.', `import seaborn as sns
import matplotlib.pyplot as plt
sns.lineplot(data=df, x='Month', y='Sales', marker='o')
plt.show()`, `[Line chart rendered: sales trend Jan-Apr]`, 'Data Visualization'),
      mk('E', 'Model Building', 'To create an interactive Plotly chart.', `import plotly.express as px
fig = px.bar(df, x='Month', y='Sales')
fig.show()`, `[Interactive bar chart opened in browser]`, 'Data Visualization'),
      mk('F', 'Result Analysis', 'To summarize the sales trend.', `print('Growth:', df['Sales'].iloc[-1] - df['Sales'].iloc[0])`, `Growth: 90`, 'Data Visualization'),
    ],
  },
  {
    id: 5,
    number: '05',
    title: 'Machine Learning Model Building',
    description:
      'Train, evaluate and compare regression and classification models using Scikit-learn.',
    module: 'Machine Learning',
    difficulty: 'Advanced',
    tools: ['Scikit-learn', 'Pandas', 'NumPy'],
    overview: {
      summary:
        'End-to-end ML: split data, train a classifier, evaluate accuracy, tune parameters and persist the model.',
      architecture: ['Dataset', 'Train/Test Split', 'Feature Scaling', 'Model Training', 'Evaluation', 'Tuning', 'Persistence', 'Prediction'],
    },
    subExperiments: [
      mk('A', 'Data Collection', 'To load the Iris dataset from Scikit-learn.', `from sklearn.datasets import load_iris
iris = load_iris()
X, y = iris.data, iris.target
print(X.shape)`, `(150, 4)`, 'Machine Learning'),
      mk('B', 'Data Cleaning', 'To split the data into training and testing sets.', `from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
print(X_train.shape, X_test.shape)`, `(120, 4) (30, 4)`, 'Machine Learning'),
      mk('C', 'Exploratory Data Analysis', 'To check class balance in the target.', `import pandas as pd
print(pd.Series(y).value_counts())`, `0    50
1    50
2    50`, 'Machine Learning'),
      mk('D', 'Data Visualization', 'To plot a scatter of sepal length vs width.', `import matplotlib.pyplot as plt
plt.scatter(X[:, 0], X[:, 1], c=y)
plt.show()`, `[Scatter plot rendered]`, 'Machine Learning'),
      mk('E', 'Model Building', 'To train a logistic regression classifier.', `from sklearn.linear_model import LogisticRegression
model = LogisticRegression(max_iter=200).fit(X_train, y_train)
print(model.score(X_test, y_test))`, `1.0`, 'Machine Learning'),
      mk('F', 'Result Analysis', 'To predict a new sample and show the class.', `print(model.predict([[5.1, 3.5, 1.4, 0.2]]))`, `[0]`, 'Machine Learning'),
    ],
  },
  {
    id: 6,
    number: '06',
    title: 'Time Series Analysis with Pandas',
    description:
      'Build and analyze time series with datetime indexes, periods, time zones and resampling using Pandas.',
    module: 'Python for Data Science',
    difficulty: 'Intermediate',
    tools: ['Python', 'Pandas', 'NumPy'],
    overview: {
      summary:
        'Create time series indexed by timestamps, generate DatetimeIndex ranges, handle time zones, work with Periods, and resample time series data.',
      architecture: ['Datetime Objects', 'DatetimeIndex', 'Time Zones', 'Periods', 'asfreq', 'Resampling', 'Time Series Output'],
    },
    subExperiments: [
      mk('A', 'Creating a Time Series', 'To create a time series in Pandas using datetime objects and use the timestamps as the index.', `import pandas as pd

dates = pd.to_datetime([
    '2026-01-01',
    '2026-01-02',
    '2026-01-03',
    '2026-01-04',
    '2026-01-05'
])
temperature = [28, 30, 29, 31, 32]
time_series = pd.Series(temperature, index=dates)
print(time_series)`, `2026-01-01    28
2026-01-02    30
2026-01-03    29
2026-01-04    31
2026-01-05    32
dtype: int64`, 'Python for Data Science'),
      mk('B', 'Date Range Generation', 'To generate a DatetimeIndex of a specified length using pandas.date_range().', `import pandas as pd

date_index = pd.date_range(
    start='2026-01-01',
    periods=7,
    freq='D'
)
print(date_index)`, `DatetimeIndex(['2026-01-01', '2026-01-02', '2026-01-03',
               '2026-01-04', '2026-01-05', '2026-01-06',
               '2026-01-07'],
              dtype='datetime64[ns]', freq='D')`, 'Python for Data Science'),
      mk('C', 'Time Zone Handling', 'To localize a time zone and convert between time zones using tz_localize and tz_convert.', `import pandas as pd

idx = pd.date_range('2026-01-01', periods=3, freq='D', tz='Asia/Kolkata')
print(idx)
print(idx.tz_convert('UTC'))`, `DatetimeIndex(['2026-01-01 00:00:00+05:30', ...], dtype='datetime64[ns, Asia/Kolkata]')
DatetimeIndex(['2025-12-31 18:30:00+00:00', ...], dtype='datetime64[ns, UTC]')`, 'Python for Data Science'),
      mk('D', 'Periods and PeriodIndex', 'To perform period arithmetic and construct a range of periods using period_range.', `import pandas as pd

periods = pd.period_range(start='2026-01', periods=4, freq='M')
print(periods)
print(periods + 1)`, `PeriodIndex(['2026-01', '2026-02', '2026-03', '2026-04'], dtype='period[M]')
PeriodIndex(['2026-02', '2026-03', '2026-04', '2026-05'], dtype='period[M]')`, 'Python for Data Science'),
      mk('E', 'Frequency Conversion', 'To convert PeriodIndex objects to another frequency with the asfreq method.', `import pandas as pd

monthly = pd.period_range('2026-01', periods=3, freq='M')
print(monthly.asfreq('D'))`, `PeriodIndex(['2026-01-31', '2026-02-28', '2026-03-31'], dtype='period[D]')`, 'Python for Data Science'),
      mk('F', 'Resampling', 'To perform resampling, downsampling and upsampling on a time series.', `import pandas as pd

idx = pd.date_range('2026-01-01', periods=10, freq='D')
s = pd.Series(range(10), index=idx)
print(s.resample('3D').mean())`, `2026-01-01    1.0
2026-01-04    4.0
2026-01-07    7.0
2026-01-10    9.0
Freq: 3D, dtype: float64`, 'Python for Data Science'),
    ],
  },
]

export default experiments
