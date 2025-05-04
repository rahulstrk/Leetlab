export const getJudge0LanguageId = (language) => {
    const lanuageMap = {
        "PYTHON" : 71,
        "JAVA" : 62,
        "JAVASCRIPT" : 63
    }

    return languageMap[language.toUpperCase()] || null;
}
export const pollBatchResults
//submitBatch
export const submitBatch = async (submissions) => {
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{submissions})

    console.log("Submission Results:", data)
    //we need to hit this endpoint 2 times.
    //1st time we will get the tokens for each language and return array of tokens.

    return data //[{token} , {token}, {token}]

}