import db from "../libs/db.js"

export const createProblem = async (req, res) => {
    //going to get the all the data from the request body
    const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolution} = req.body;
    //going to check the user role once again

    if(req.user.role !== "ADMIN"){
        return res.status(403).json({message: "You are not allowed to create a problem"})
    }
    //loop through each reference solution for different Languages.
    try {
        for(const [Language, solutionCode] of Object.entries(referenceSolution)){
            
        }
    } catch (error) {
        
    }
}

export const getAllProblems = async (req, res) => {}

export const getproblemById = async (req, res) => {}

export const updateProblem = async (req, res) => {}

export const deleteProblem = async (req, res) => {}

export const getAllProblemsSolvedByUser = async (req, res) => {}