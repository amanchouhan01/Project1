document.addEventListener("DOMContentLoaded",function(){

    const searchButtton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatscontainer = document.querySelector(".stats-cards"); 


    //return true  or false based on regex(regular expression)
    function validateUsername(username){
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching){
            alert("Invalid Username")
        }
        return isMatching;
    }
    
    async function fetchUserDetails(username) {


        //const url = 'https://leetcode.com/graphql'
        try{
            searchButtton.textContent = "Searching...";
            searchButtton.disabled = true;
            
            //const response =awaitfetch(url);

        const proxyUrl ='https://cors-anywhere.herokuapp.com/'   
        const targetUrl = 'https://leetcode.com/graphql/';
        const myHeaders =new Headers();
        myHeaders.append("content-type","application/json");

        const graphql = JSON.stringify({
  query: `
    query userSessionProgress($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `,
  variables: { username }
});
         
          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
            redirect: "follow"
          }

         const response = await fetch(proxyUrl+targetUrl, requestOptions);
 
 
            if(!response.ok) {
                throw new Error("Unable to fetchh the User details");
            }
            const parsedData = await response.json();
            console.log("Logging data:", parsedData);
            displayUserData(parsedData);

        } 
        catch(error){
            statsContainer.innerHTML = '<p>No data found</p>'
        }
        finally{
            searchButtton.textContent= "Search"
            searchButtton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle){
    const progressDegree = (solved/total)*100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`  );
    label.textContent = `${solved}/${total}`;
    
    }
    
    function displayUserData(parsedData) {
      const totalQues = parsedData.data.allQuestionsCount[0].count;
      const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
      const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
      const totalHardQues = parsedData.data.allQuestionsCount[3].count;


      const solvedTotalQues = parsedData.data.matchedUser.submitStats.
      acSubmissionNum[0].count;
      const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.
      acSubmissionNum[1].count;
      const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.
      acSubmissionNum[2].count;
      const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.
      acSubmissionNum[3].count;


      updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel,
        easyProgressCircle);
      updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel,
        mediumProgressCircle);
      updateProgress(solvedTotalHardQues, totalHardQues, hardLabel,
        hardProgressCircle);  


      const cardData = [
          {label:"Overall Submissions", value:parsedData.
            data.matchedUser.submitStats.totalSubmissionNum[0].
            submissions},
          {label:"Overall Easy Submissions", value:parsedData.
            data.matchedUser.submitStats.totalSubmissionNum[1].
            submissions},
          {label:"Overall Medium Submissions", value:parsedData.
            data.matchedUser.submitStats.totalSubmissionNum[2].
            submissions},
          {label:"Overall Hard Submissions", value:parsedData.
            data.matchedUser.submitStats.totalSubmissionNum[3].
            submissions},
          
      ];

      console.log("card ka data:" , cardData);

    

    }  


    searchButtton.addEventListener('click', function(){
        const username = usernameInput.value;
        console.log("login username:", username);
        if (validateUsername(username)){
            fetchUserDetails(username);
        }
    })


 })