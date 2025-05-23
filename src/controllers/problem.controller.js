import {db} from "../libs/db.js"

export const createProblem = async (req, res) => {
  //get details for request body-> title, description, difficulty, tags, examples, constraints, testcases,codeSnippets,referenceSolutions

    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
      } = req.body;
    
      // going to check the user role once again if it is admin or not

      if(req.user.role  !== "ADMIN") {
        return res.status(403).json 
        (
          {
            error: " You are not allowed to create a problem"
          }
        )
      }

      
    
      try {
        //loop through each entries of reference solution and get the language Id
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
          const languageId = getJudge0LanguageId(language);
          
        //check if LanguageId is avaialble for the given language 
          if (!languageId) {
            return res
              .status(400)
              .json({ error: `Language ${language} is not supported` });
          }
    
          //
          const submissions = testcases.map(({ input, output }) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output,
          }));
    
          const submissionResults = await submitBatch(submissions);
    
          const tokens = submissionResults.map((res) => res.token);
    
          const results = await pollBatchResults(tokens);
    
          for (let i = 0; i < results.length; i++) {
            const result = results[i];
            console.log("Result-----", result);
            // console.log(
            //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
            // );
            if (result.status.id !== 3) {
              return res.status(400).json({
                error: `Testcase ${i + 1} failed for language ${language}`,
              });
            }
          }
        }
    
        const newProblem = await db.problem.create({
          data: {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
            userId: req.user.id,
          },
        });
    
        return res.status(201).json({
          sucess: true,
          message: "Message Created Successfully",
          problem: newProblem,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          error: "Error While Creating Problem",
        });
      }
};


export const getAllProblems = async (req, res) => {}

export const getproblemById = async (req, res) => {}

export const updateProblem = async (req, res) => {}

export const deleteProblem = async (req, res) => {}

export const getAllProblemsSolvedByUser = async (req, res) => {}