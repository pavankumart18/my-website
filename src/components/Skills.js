import React from 'react';
import Card from './Card'; // Ensure this path matches your actual Card component

const Skills = () => {
  const skillsData = [
    {
      label: 'Python',
      uri: process.env.PUBLIC_URL + '/images/python.png',
      details: [
        'Experienced in data analysis with pandas',
        'Developed web applications with Django',
      ],
    },
    {
      label: 'C++',
      uri: process.env.PUBLIC_URL + '/images/Cpp.png',
      details: [
        'Implemented algorithms and data structures',
        'Worked on performance optimization',
      ],
    },
    {
      label: 'Google Cloud',
      uri: process.env.PUBLIC_URL + '/images/gcloud.png',
      details: [
        'Cloud computing services provided by Google',
        'Used for building and deploying applications on Google Cloud Platform',
      ],
    },
    {
      label: 'React Js/Native',
      uri: process.env.PUBLIC_URL + '/images/reactjs.png',
      details: [
        'Built interactive user interfaces',
        'Developed mobile applications with React Native',
      ],
    },
    {
      label: 'Vertex AI',
      uri: process.env.PUBLIC_URL + '/images/vertexai.png',
      details: [
        'Managed machine learning services on Google Cloud',
        'Used for building and deploying machine learning models',
      ],
    },
    {
      label: 'SQL',
      uri: process.env.PUBLIC_URL + '/images/sql.png',
      details: [
        'Standard language for storing, manipulating, and retrieving data in databases',
        'Used in relational database management systems (RDBMS)',
      ],
    },
    {
      label: 'HTML',
      uri: process.env.PUBLIC_URL + '/images/html.png',
      details: [
        'Structured the content of web pages',
        'Used for creating basic web layouts',
      ],
    },
    {
      label: 'CSS',
      uri: process.env.PUBLIC_URL + '/images/css.png',
      details: [
        'Styled HTML elements for better presentation',
        'Utilized for responsive web design',
      ],
    },
    {
      label: 'JavaScript',
      uri: process.env.PUBLIC_URL + '/images/js.png',
      details: [
        'Developed interactive and dynamic web pages',
        'Used in front-end web development',
      ],
    },
    {
      label: 'Node.js',
      uri: process.env.PUBLIC_URL + '/images/nodejs.png',
      details: [
        'Used for building scalable network applications',
        'Server-side JavaScript runtime environment',
      ],
    },
    {
      label: 'MongoDB',
      uri: process.env.PUBLIC_URL + '/images/mongodb.png',
      details: [
        'NoSQL database for scalable applications',
        'Document-based data storage',
      ],
    },
    {
      label: 'Django',
      uri: process.env.PUBLIC_URL + '/images/django.png',
      details: [
        'High-level Python web framework',
        'Used for rapid development and clean design',
      ],
    },
    {
      label: 'Numpy',
      uri: process.env.PUBLIC_URL + '/images/numpy.png',
      details: [
        'Scientific computing with Python',
        'Efficient manipulation of multi-dimensional arrays',
      ],
    },
    {
      label: 'Pandas',
      uri: process.env.PUBLIC_URL + '/images/pandas.png',
      details: [
        'Data manipulation and analysis with Python',
        'Provides data structures and operations for manipulating numerical tables and time series',
      ],
    },
    {
      label: 'Data Science',
      uri: process.env.PUBLIC_URL + '/images/datascience.png',
      details: [
        'Interdisciplinary field that uses scientific methods, algorithms, and systems to extract knowledge and insights from structured and unstructured data',
        'Involves data mining, machine learning, statistics, and data analysis',
      ],
    },
    {
      label: 'Machine Learning',
      uri: process.env.PUBLIC_URL + '/images/machine.png',
      details: [
        'Branch of artificial intelligence that focuses on the development of algorithms that allow computers to learn from and make predictions or decisions based on data',
        'Involves supervised learning, unsupervised learning, and reinforcement learning',
      ],
    },
    {
      label: 'R Programming',
      uri: process.env.PUBLIC_URL + '/images/r.png',
      details: [
        'Programming language and free software environment for statistical computing and graphics',
        'Used widely in statistical computing and data analysis',
      ],
    },
    {
      label: 'MATLAB',
      uri: process.env.PUBLIC_URL + '/images/matlab.png',
      details: [
        'High-performance language for technical computing',
        'Used for algorithm development, data visualization, data analysis, and numeric computation',
      ],
    },
  ];

  const toolsData = [
    {
      label: 'Git',
      uri: process.env.PUBLIC_URL + '/images/github.png',
      details: ['Version control system for tracking changes in source code during software development'],
    },
    {
      label: 'Visual Studio',
      uri: process.env.PUBLIC_URL + '/images/visualstudio.png',
      details: ['Integrated development environment (IDE) for building applications on Windows, Android, and iOS platforms'],
    },
    {
      label: 'R Studio',
      uri: process.env.PUBLIC_URL + '/images/rstudio.png',
      details: ['Integrated development environment (IDE) for R programming language'],
    },
    {
      label: 'Google Colab',
      uri: process.env.PUBLIC_URL + '/images/colab.png',
      details: ['Free cloud-based platform that includes Jupyter notebooks and supports free GPU'],
    },
    {
      label: 'Kaggle',
      uri: process.env.PUBLIC_URL + '/images/kaggle.webp',
      details: ['Online community and platform for data science competitions, datasets, and notebooks'],
    },
    {
      label: 'Matlab',
      uri: process.env.PUBLIC_URL + '/images/matlabl.png',
      details: ['Numerical computing environment and programming language'],
    },
  ];

  return (
    <div className="skills-tools-container">
      <div className="skills-container">
        <h2 className="skills-heading">Skills</h2>
        {skillsData.map((skill, index) => (
          <Card
            key={index}
            label={skill.label}
            uri={skill.uri}
            details={skill.details}
          />
        ))}
      </div>

      <div className="tools-container">
        <h2 className="tools-heading">Tools</h2>
        {toolsData.map((tool, index) => (
          <Card
            key={index}
            label={tool.label}
            uri={tool.uri}
            details={tool.details}
          />
        ))}
      </div>
    </div>
  );
};

export default Skills;
