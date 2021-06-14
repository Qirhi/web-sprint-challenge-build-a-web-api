// Write your "projects" router here!
const Projects = require('./projects-model');
const Actions = require('../actions/actions-model');
const express = require('express');
const router = express.Router();

const {
    validateProject,
    validateProjectForUpdate,
    validateProjectId
} = require('../middleware/middleware');


// PROJECTS ENDPOINTS

router.get('/', (req, res) => {
    // console.log("req.query: ", req.query)
    Projects.get()
        .then((response) => {
            // console.log("response: ", response) // response is array of all projects
            if (!response) {
                res.status(404).json([])
            } else {
                res.status(200).json(response)
            }
        })
        .catch((error) => {
            // console.log("error",error)
            res.status(500).json({
                message: 'Error retrieving the projects.',
            });
        });
}); 

router.get('/:id', validateProjectId, (req, res) => {

    Projects.get(req.params.id)
    
        .then((projectWithId) => {
            // console.log("projectWithId: ", projectWithId); // response is project with given id
            res.status(200).json(projectWithId);
        })
        .catch((error) => {
            // console.log("error", error)
            res.status(500).json({ message: `Error retrieving the project of id ${req.params.id}: ${error.message}`})
        })
});

router.post('/', validateProject, (req, res) => {
    const body = req.body;
    // console.log("req.body: ", body)

        Projects.insert(body)
            .then((postedProject) => {
                // console.log("postedProject", postedProject) // response is posted project
                res.status(200).json(postedProject);
            })
            .catch((error) => {
                // console.log("error", error)
                res.status(500).json({ message: `Error retrieving the project of id ${req.params.id}: ${error.message}`})
            });
});

router.put('/:id', validateProjectForUpdate, validateProjectId, (req, res) => {
    const id = req.params.id;
    const changes = req.body;

        Projects.update(id, changes)
        .then((updateResponse) => res.status(200).json(updateResponse))
        .catch((updateError) => {
            // console.log("updateError", updateError)
            res.status(400).json({ message: `Unable to update project. Missing fields.`})
        })
});

router.delete('/:id', validateProjectId, (req,res) => {
    const id = req.params.id;

    Projects.get(id)
    
        .then((response) => {
            // console.log("response: ", response); // response is project with given id

                console.log("found the project to delete: ", response)
                Projects.remove(id)
                    .then((deleteResponse) => {
                        // console.log("deleteResponse: ", deleteResponse)
                        res.status(200).json(response)
                    })
                    // Question: How can I return both the response & msg

                    .catch ((error) => {
                        // console.log("error", error)
                        res.status(400).json({ message: `Unable to delete project.`})
                    })

        })
        .catch((error) => {
            console.log("error", error)
            res.status(500).json({ message: `Error, the project of id ${id} could not be deleted: ${error}`})
        })

});

router.get('/:id/actions', validateProjectId, (req,res) => {
    const id = req.params.id;
    
    Actions.get()
        .then((actions) => {
            // console.log("actions: ", actions); // response is an array with all actions

                const filteredActions = actions.filter((action => {
                    // console.log("Action project id: ", action.project_id)
                    // console.log("id: ", id)
                    return action.project_id === Number(id);
                }));
                // console.log("filteredActions: ",filteredActions)
                res.status(200).json(filteredActions);

        })
        .catch((error) => {
            // console.log("error", error)
            res.status(500).json({ message: `Error, the project of id ${id} could not be deleted: ${error}`})
        })


});



module.exports = router;