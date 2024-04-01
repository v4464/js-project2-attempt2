const API_URL = "https://crudcrud.com/api/14ba1b8b5a7447b895610cf7b46a56d2/votes";

document.getElementById("votingForm").addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();
  const studentName = event.target.studentName.value;
  const monitorSelected = event.target.chooseMonitor.value;

  const voteData = {
    studentName: studentName,
    monitorSelected: monitorSelected
  };
  axios.post(API_URL, voteData)
    .then(response => {
      updateMonitorSection(response.data);
      updateTotalVotes();
      event.target.reset();
    })
    .catch(error => console.error(error));
}

function updateMonitorSection(voteData) {
  const monitorId = voteData.monitorSelected + "Votes";
  const monitorVotesElement = document.getElementById(monitorId);

  if (monitorVotesElement) {
    const voteCount = parseInt(monitorVotesElement.textContent.split(":")[1].trim()) + 1;
    monitorVotesElement.textContent = `Votes: ${voteCount}`;

    const voteDetailsDiv = document.createElement("div");

    const studentNameSpan = document.createElement("span");
    studentNameSpan.textContent = voteData.studentName;
    voteDetailsDiv.appendChild(studentNameSpan);

    const voteCountSpan = document.createElement("span");
    voteCountSpan.textContent = ` - Votes: ${voteCount}`;
    voteDetailsDiv.appendChild(voteCountSpan);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      axios.delete(`${API_URL}/${voteData._id}`)
        .then(() => {
          monitorVotesElement.textContent = `Votes: ${voteCount - 1}`;
          updateTotalVotes();
          voteDetailsDiv.parentNode.removeChild(voteDetailsDiv);
        })
        .catch(error => console.error(error));
    });

    voteDetailsDiv.appendChild(deleteBtn);

    monitorVotesElement.parentNode.appendChild(voteDetailsDiv);
  }
}

function updateTotalVotes() {
  axios.get(API_URL)
    .then(response => {
      const totalVotes = response.data.length;
      document.getElementById("totalVotes").textContent = totalVotes;
    })
    .catch(error => console.error(error));
}

axios.get(API_URL)
  .then(response => {
    response.data.forEach(voteData => {
      updateMonitorSection(voteData);
    });
    updateTotalVotes();
  })
  .catch(error => console.error(error));


