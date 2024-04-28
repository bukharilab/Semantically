# Enhancing Biomedical Knowledge Representation Through Knowledge Graphs
Even considering the significant enhancements by the social-technical and personalized approaches, there were still some flaws left unaddressed in the current methodology. Firstly, annotation recommendations were isolated to separate community posts and direct collaboration with personalized experts. This leads to difficulty in accessing the most up to date information on the most optimal annotation recommendations immediately. Previously, Semantically stored its data in a tabular format in MySQL. Due to this, the data lacks machine-readability and the meanings behind different entities (Questions, replies, ontologies, vote tally etc.) and their relationships is obscured. With these shortcomings in mind, we propose to further extend the methodology by integrating a Knowledge Graph based recommendaiton system that provides an environment for exploring the most optimal annotation recommendations retrieved in the form of a knowledge graph. 

## Abstract
The rise in online biomedical information has led to challenges in data retrieval, primarily due to insufficient semantic metadata. While semantic annotators have advanced in addressing this problem, they still lack accuracy, speed, and, most importantly, dynamic knowledge representation—an essential aspect of AI that enables human-like reasoning. Several techniques to achieve knowledge representation, such as Knowledge Graphs, have been introduced to improve current systems in many domains, including the biomedical domain. Knowledge Graphs, recognized for their semantic richness, show promise in enhancing the biomedical semantic annotation process. We propose a knowledge graph-based recommendation system, augmented with NLP for search queries, designed for the Semantically biomedical content annotation platform. This system aims to provide quick and easy access to optimal, machine-readable recommendations and graphically visualize recommendations in a knowledge graph format. Still, to build the knowledge graph and the interface, we had to address challenges and issues with the current system. Semantically uses a relational schema for data storage, which does not support machine-readable content that would allow search engines to understand and suggest annotations easily. Inherent differences in the sequential query language and cipher language mean that the backend for data manipulation must be rewritten entirely to support Neo4j operations. A knowledge graph interface with graph visualizations was also needed to present optimal recommendations to users. Our approach to these challenges is to migrate the MySQL database to a Neo4j database to create a knowledge graph database. Then, we rewrote the backend to connect to Neo4j and support cipher language queries. Using data visualization JavaScript libraries like D3.js, we wrote a knowledge graph interface that returns a graph visualization of annotation recommendations obtained from the knowledge graph. We verify the effectiveness of the knowledge graph through an evaluation survey taken by 20 people, testing its ability to represent knowledge dynamically. The results show a mostly positive reception for all positive and negative system characteristics, with crucial metrics such as speed, precision, and clarity with agreement percentages of 100%, 95%, and 95%, respectively.  A demo of the knowledge graph-based recommendation system is available at (https://github.com/bukharilab/KG4BioMedCntnAuthoring/tree/neo4j_setup). 

## Methodology

### Figure 2.1 Semantically+Dynamic Knowledge Graph Representation and Interface
![alt-text](https://github.com/SebC750/SebC750.github.io/blob/1b378e8297c78b594c6c2aee1308ec6b559232cb/media/images/KG_Semantically_Workflow_bg.png)
Semantically is a free-to-use tool that automates the process of annotating biomedical documents with semantic information, enabling more accurate search results. Initially, Semantically was created to streamline this process by automating NLP techniques that typically require manual input from domain experts. It achieves this by using the NCBO web-service resource REST API to identify concepts and return all the ontologies in which they are defined. However, we also introduced novel enhancements to tackle issues that other annotation systems struggle with, such as a social-technical and personalized enhancement. We also plan to integrate a knowledge graph-based recommendation system into Semantically's workflow to enhance annotation recommendations through dynamic knowledge representation further. Ultimately, we want to achieve dynamic knowledge representation and present an improved semantic annotation process through this integration.

### Figure 2.2 Dynamic Knowledge Graph Recommendation System Development and Functionality
![alt-text](https://github.com/SebC750/SebC750.github.io/blob/1b378e8297c78b594c6c2aee1308ec6b559232cb/media/images/KG_Development_Process_bg.png)
To develop the knowledge graph, we first transitioned from MySQL to the graph-oriented Neo4j database, utilizing the Neo4j ETL tool for effective schema mapping. This tool automatically detected and mapped node attributes and relationships from our MySQL metadata. However, manual adjustments were essential for optimal data representation, such as modifying how vote tables were handled, converting them from relationships to distinct nodes linked to the post-reply node, as depicted in Neo4j query examples. Significant effort went into rewriting backend code to accommodate Neo4j's Cypher query language, shifting from traditional tabular operations to focusing on data relationships. This involved using the Neo4j PHP laudis library for PHP compatibility, writing api calls for data retrieval and adjusting the user interface to support a Knowledge Graph search tab in the front-end. This tab features advanced options like Named Entity Recognition (NER) and filters for specific categories, such as medical terms and ontologies. The search results are visually represented using D3.js, with color-coded nodes and detailed labels to illustrate relationships. For instance, green nodes represent suggested ontologies, red nodes are replies from domain experts, and other colors signify different elements like vote counts and confidence scores. Users can directly access related forum posts by clicking on nodes, facilitating easier navigation and exploration of relevant content. Additionally, the interface allows searches for domain experts and ontologies, displaying top-rated recommendations by experts with a profile rank node indicating their trustworthiness based on historical data. A supplementary table highlights top recommendations based on the final score, which is calculated based on variables such as confidence score, rating score and wilson score.
### Figure 2.3 Results of a Neo4j domain expert cypher query
![image](https://github.com/bukharilab/KG4BioMedCntnAuthoring/assets/75767177/62ea2823-3cad-4398-816d-5b563edefbf3)
This figure presents an example of the knowledge graph database working. In this example, a user searches for a domain expert called "Sebastian Chalarca", which then returns a graph structure consisting of the domain experts, the suggested ontologies, replies and critical reception for replies.  
### Figure 2.4 Results of a search query for the term “sleep paralysis”
![image](https://github.com/bukharilab/KG4BioMedCntnAuthoring/assets/75767177/54ab0313-0a32-4984-9d63-f932468a1241)

### Figure 2.5 Recommendation Rankings for "Sleep paralysis"
![image](https://github.com/bukharilab/KG4BioMedCntnAuthoring/assets/75767177/2adeaf74-4526-44d3-8a44-dee4910ac5a5)
### Figure 2.6 Breakdown of the Wilson score formula
![image](https://github.com/bukharilab/KG4BioMedCntnAuthoring/assets/75767177/3b7d24b8-ea4d-430c-9151-aad7a3a4945a)

## Results
### Figure 3.1 Distribution of Responses Bar Chart
![image](https://github.com/bukharilab/KG4BioMedCntnAuthoring/assets/75767177/e044bf36-f866-4a52-abe2-9fd3136852ae)

### Figure 3.2 Distribution of Responses Tab
![image](https://github.com/bukharilab/KG4BioMedCntnAuthoring/assets/75767177/9fec22b5-b9e3-49d8-9d06-c7d4ef2f858e)

## Project Demo Materials

### Use-Case Scenario for Medical Term "Virus-Replication-Cycle"
(https://github.com/SebC750/SebC750.github.io/blob/9987f555ec09dee86a7608b140ab2d573ecaebd8/media/Knowledge-graph-result.mp4)

### User Knowledge Graph Example
(https://github.com/SebC750/SebC750.github.io/blob/9987f555ec09dee86a7608b140ab2d573ecaebd8/media/User-KG-result.mp4)

### Medical Term Knowledge Graph Example
(https://github.com/SebC750/SebC750.github.io/blob/9987f555ec09dee86a7608b140ab2d573ecaebd8/media/medical_term-KG-result.mp4)

### Ontology Knowledge Graph Example
(https://github.com/SebC750/SebC750.github.io/blob/9987f555ec09dee86a7608b140ab2d573ecaebd8/media/Ontology-KG-result1.mp4)

## 🛠 Technologies
### Front End
HTML, CSS, javascript bootstrap, jquery

### Backend
PHP and Python

### Framework
React Js, Flask


## Project Team
- [Sebastian Chalarca](https://www.linkedin.com/in/sebastian-chalarca-603939201/)
- [Dr.Syed Ahmad Chan Bukhari (PI)](https://www.stjohns.edu/academics/faculty/syed-ahmad-chan-bukhari)
- [Asim Abbas](https://www.linkedin.com/in/asim-abbas-b2891ab8/)
- [Mutahira Khalid](https://www.linkedin.com/in/mutahira-khalid-9b3327221/)
- [Dr,Fazel Keshtkar](https://www.stjohns.edu/academics/faculty/fazel-keshtkar)

## Related Research Papers and Literature

| Authors                                                                       | Title                                                                                                                                 | Paper Link                                                                                               |   Year |
|:------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------|-------:|
| N. Fiorini, D. J. Lipman, Z. Lu                                               | Towards PubMed 2.0                                                                                                                    | https://doi.org/10.7554/eLife.28801                                                                      |   2017 |
| E. W. Sayers et al.                                                           | Database resources of the National Center for Biotechnology Information.                                                              | https://doi.org/10.1093/nar/gkaa892                                                                      |   2021 |
| R. Davis, H. Shrobe, P. Szolovits                                             | What Is a Knowledge Representation?                                                                                                   | https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/1029                                   |   1993 |
| J. P. Delgrande, B. Glimm, T. Meyer, M. Truszczynski, F. Wolter               | Current and Future Challenges in Knowledge Representation and Reasoning                                                               | http://arxiv.org/abs/2308.04161                                                                          |   2023 |
| R. Chandra, S. Tiwari, S. Agarwal, N. Singh                                   | Semantic web-based diagnosis and treatment of vector-borne diseases using SWRL rules                                                  | https://doi.org/10.1016/j.knosys.2023.110645                                                             |   2023 |
| Y. Shen, C. Guo, H. Li, J. Chen, Y. Guo, X. Qiu                               | Financial Feature Embedding with Knowledge Representation Learning for Financial Statement Fraud Detection                            | https://doi.org/10.1016/j.procs.2021.04.110                                                              |   2021 |
| M. Waibel et al.                                                              | RoboEarth                                                                                                                             | https://doi.org/10.1109/MRA.2011.941632                                                                  |   2011 |
| A. Ait-Mlouk, L. Jiang                                                        | KBot: A Knowledge Graph Based ChatBot for Natural Language Understanding Over Linked Data                                             | https://doi.org/10.1109/ACCESS.2020.3016142                                                              |   2020 |
| E. Tseytlin, K. Mitchell, E. Legowski, J. Corrigan, G. Chavan, R. S. Jacobson | NOBLE – Flexible concept recognition for large-scale biomedical natural language processing                                           | https://doi.org/10.1186/s12859-015-0871-y                                                                |   2016 |
| D. Campos, S. Matos, J. L. Oliveira                                           | A modular framework for biomedical concept recognition                                                                                | https://doi.org/10.1186/1471-2105-14-281                                                                 |   2013 |
| N. H. Shah, N. Bhatia, C. Jonquet, D. Rubin, A. P. Chiang, M. A. Musen        | Comparison of concept recognizers for building the Open Biomedical Annotator.                                                         | https://doi.org/10.1186/1471-2105-10-S9-S14                                                              |   2009 |
| C. Jonquet, N. H. Shah, C. H. Youn, M. A. Musen, C. Callendar, M.-A. Storey   | NCBO Annotator: Semantic Annotation of Biomedical Data                                                                                | https://www.researchgate.net/publication/228837476_NCBO_Annotator_Semantic_Annotation_of_Biomedical_Data |   2009 |
| A. R. Aronson                                                                 | Effective mapping of biomedical text to the UMLS Metathesaurus: the MetaMap program.                                                  | https://pubmed.ncbi.nlm.nih.gov/11825149/                                                                |   2001 |
| A. Rossanez, J. C. dos Reis, R. da S. Torres, H. de Ribaupierre               | KGen: a knowledge graph generator from biomedical scientific literature                                                               | https://doi.org/10.1186/s12911-020-01341-5                                                               |   2020 |
| T. Ruan, Y. Huang, X. Liu, Y. Xia, J. Gao                                     | QAnalysis: A question-answer driven analytic tool on knowledge graphs for leveraging electronic medical records for clinical research | https://doi.org/10.1186/s12911-019-0798-8                                                                |   2019 |
| D. Domingo-Fernández et al.                                                   | Multimodal mechanistic signatures for neurodegenerative diseases (NeuroMMSig): a web server for mechanism enrichment                  | https://doi.org/10.1093/bioinformatics/btx399                                                            |   2017 |
| X. He et al.                                                                  | ALOHA: developing an interactive graph-based visualization for dietary supplement knowledge graph through user-centered design.       | https://doi.org/10.1186/s12911-019-0857-1                                                                |   2019 |
| R. Wang, Z. Yang                                                              | SQL vs NoSQL: A Performance Comparison                                                                                                | https://www.cs.rochester.edu/courses/261/fall2017/termpaper/submissions/06/Paper.pdf                     |   2017 |
| W. Khan, W. Ahmad, B. Luo, E. Ahmed                                           | SQL Database with physical database tuning technique and NoSQL graph database comparisons                                             | https://doi.org/10.1109/ITNEC.2019.8729264                                                               |   2019 |
| L. Stanescu                                                                   | A Comparison between a Relational and a Graph Database in the Context of a Recommendation System                                      | https://doi.org/10.15439/2021f33                                                                         |   2021 |
| D. Ringler, H. Paulheim                                                       | One Knowledge Graph to Rule Them All? Analyzing the Differences Between DBpedia, YAGO, Wikidata & co.                                 | https://doi.org/10.1007/978-3-319-67190-1_33                                                             |   2017 |
| J. D’Souza, A. P. K., D. S., C. Fernandes, K. M. Kavitha, C. Naik             | Knowledge-Based Scene Graph Generation in Medical Field                                                                               | https://doi.org/10.1109/DISCOVER58830.2023.10316715                                                      |   2023 |
| G. Gawriljuk, A. Harth, C. A. Knoblock, P. Szekely                            | A Scalable Approach to Incrementally Building Knowledge Graphs                                                                        | https://doi.org/10.1007/978-3-319-43997-6_15                                                             |   2016 |
| V. V. Nigam, S. Paul, A. P. Agrawal, R. Bansal                                | A Review Paper On The Application Of Knowledge Graph On Various Service Providing Platforms                                           | https://doi.org/10.1109/Confluence47617.2020.9058298                                                     |   2020 |
| A. Abbas, M. Khalid, S. Chalarca, F. Keshtkar, S. A. C. Bukhari               | Enhancing Biomedical Semantic Annotations through a Knowledge Graph-Based Approach                                                    | https://doi.org/10.32473/flairs.36.133253                                                                |   2023 |
| A. Abbas, S. Mbouadeu, T. Hameed, S. Bukhari                                  | Personalized Semantic Annotation Recommendations on Biomedical Content Through an Expanded Socio-Technical Approach                   | https://doi.org/10.5220/0011926700003414                                                                 |   2023 |
| A. Abbas, T. Hameed, F. Keshtkar, S. Kadry, S. A. C. Bukhari                  | A socio-technical approach to trustworthy semantic biomedical content generation and sharing                                          | https://doi.org/10.1016/j.ins.2024.120441                                                                |   2024 |
| E. B. Wilson                                                                  | Probable Inference, the Law of Succession, and Statistical Inference                                                                  | https://doi.org/10.1080/01621459.1927.10502953                                                           |   1927 |

# Installation and Deployment

## Project Setup Instructions

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your system. Download it [here](https://nodejs.org/).
- **XAMPP or WAMP**: Choose and install either [XAMPP](https://www.apachefriends.org/index.html) or [WAMP](http://www.wampserver.com/) for a local server environment.

### Option 1: Local Neo4j setup

To run this project and neo4j database locally, follow these steps:

1. **Install XAMPP or WAMP**  
   - Download and install [XAMPP](https://www.apachefriends.org/index.html) or [WAMP](http://www.wampserver.com/) on your system to set up a local server environment.

2. **Install Neo4j Desktop**
   - If you don't have Neo4j Desktop installed, follow this link to the installation guide and follow the instructions: 
   [neo4j desktop download link](https://neo4j.com/deployment-center/?desktop-gdb)
   - After installation is complete, open Neo4j desktop and create a new database. 
   - Take note of the configuration variables (connection type, connection url, username, password) for configuring
   the env file.

3. **Configure Neo4j Database Connection**  
   - Once you take notes of your configuration variables, then connect to the Neo4j local instance by editing the `database.php` file located in `KG4BioMedCntnAuthoring => api => config`.     
   
   #### .env file example
   - NEO4J_CONNECTION_TYPE=<YOUR_NEO4J_CONNECTION_TYPE>
   - NEO4J_CONNECTION_URL=<YOUR_NEO4J_CONNECTION_TYPE>://<YOUR_NEO4J_INSTANCE>
   - NEO4J_USERNAME=<YOUR_USERNAME>
   - NEO4J_PASSWORD=<YOUR_PASSWORD>

   *Note: The values shown are placeholders. Be sure to replace them with your actual Neo4j connection credentials.

4. **Run Semantically**
   Once all configurations are done, access the project root folder by terminal. Install dependencies first using "npm i" so that the program can run. Then, run "npm start" to start the project.

### Option 2: Using Neo4j Aura (Cloud Instance)

To run this project locally and connect to a cloud hosted Neo4j instance: 

1. **Install XAMPP or WAMP**  
   Download and install [XAMPP](https://www.apachefriends.org/index.html) or [WAMP](http://www.wampserver.com/) on your system to set up a local server environment.

2. **Sign up for Neo4j Aura**  
   Create a free cloud instance on [Neo4j Aura](https://neo4j.com/cloud/aura/). Follow the instructions for setting up an account. This is a managed Neo4j service, so you don’t need to install anything locally.

3. **Create a Database**  
   After signing up, create a new database instance and take note of the connection details (e.g., instance URL, username, and password).

4. **Configure Environment Variables**  
   - Connect to your Neo4j Aura database by editing the `database.php` file located in `KG4BioMedCntnAuthoring => api => config`.    
   - Update the `ClientBuilder` to use your Neo4j credentials. Be sure to set up a `.env` file (not included in this repository) to securely store your credentials, like so:

   #### .env file example
   - NEO4J_CONNECTION_TYPE=<YOUR_NEO4J_CONNECTION_TYPE>
   - NEO4J_CONNECTION_URL=<YOUR_NEO4J_CONNECTION_TYPE>://<YOUR_NEO4J_INSTANCE>
   - NEO4J_USERNAME=<YOUR_USERNAME>
   - NEO4J_PASSWORD=<YOUR_PASSWORD>

   *Note: The values shown are placeholders. Be sure to replace them with your actual Neo4j connection credentials.

5. **Run Semantically**
   Once all configurations are done, access the project root folder by terminal. Install dependencies first using "npm i" so that the program can run. Then, run "npm start" to start the project.

# Knowledge Graph Based Recommendation System Demo Page

  The demo page for the Knowledge Graph based Recommendation System is now live at: (https://sebc750.github.io/). You may look at the provided media to evaluate the current system and provide feedback through the survey below the page. The demo page and survey is translatable to both English and Spanish.

# Semantically Editor Demo Click to watch
[![Demo CountPages alpha](https://github.com/bukharilab/Semantically/blob/master/landing/src/demo_img.png)](https://gosemantically.com/)

# Project Log
![alt text](https://github.com/ahmadchan/Semantically/blob/master/logo.png)

# A project by:

![alt text](http://bukharilab.org/wp-content/uploads/2021/05/bukharilab-removebg-preview-1.png)

