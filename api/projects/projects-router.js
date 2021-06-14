// Write your "projects" router here!
const Projects = require('./projects-model');
const Actions = require('../actions/actions-model');
const express = require('express');
const router = express.Router();

const {
    logger,
    // validateActionId,
    // validateProjectId,
    // validateAction,
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

router.put('/:id', validateProjectForUpdate, (req, res) => {
    const id = req.params.id;
    const changes = req.body;

        Projects.update(id, changes)
        .then((updateResponse) => {
            console.log("updateResponse", updateResponse) // response is either null or updated project object
            if (!updateResponse) {
                res.status(404).json({ message: `Project of id ${id} not found`})
            } else {
                res.status(200).json(updateResponse);
            }
        })
        .catch((updateError) => {
            console.log("updateError", updateError)
            res.status(400).json({ message: `Unable to update project. Missing fields.`})
        })
});

router.delete('/:id', (req,res) => {
    const id = req.params.id;
    console.log("id from router delete: ", id)


    Projects.get(id)
    
        .then((response) => {
            console.log("response: ", response); // response is project with given id
            if (response) {
           
                console.log("found the project to delete: ", response)
                Projects.remove(id)
                    .then((deleteResponse) => {
                        console.log("deleteResponse: ", deleteResponse)
                        res.status(200).json({ message:  `Success! Delete project of id ${id}`})
                    })
                    .catch ((error) => {
                        console.log("error", error)
                        res.status(400).json({ message: `Unable to delete project.`})
                    })

            } else {
                res.status(404).json({ message: `Project of ${id} not found`})
            }
        })
        .catch((error) => {
            console.log("error", error)
            res.status(500).json({ message: `Error, the project of id ${id} could not be deleted: ${error}`})
        })

});

router.get('/:id/actions', (req,res) => {
    const id = req.params.id;
    console.log("id: ", id)
    
    Actions.get()
        .then((actions) => {
            console.log("actions: ", actions); // response is an array with all actions
            if (actions) {
                const filteredActions = actions.filter((action => {
                    console.log("Action project id: ", action.project_id)
                    console.log("id: ", id)
                    return action.project_id === Number(id);
                }));
                console.log("filteredActions: ",filteredActions)
                res.status(200).json(filteredActions);
            } else {
                res.status(404).json([]);
            }
        })
        .catch((error) => {
            console.log("error", error)
            res.status(500).json({ message: `Error, the project of id ${id} could not be deleted: ${error}`})
        })


});



module.exports = router;