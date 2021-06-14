const Actions = require('../actions/actions-model');
const Projects = require('../projects/projects-model');

function logger(req, res, next) {

    let current_datetime = new Date();
    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      current_datetime.getHours() +
      ":" +
      current_datetime.getMinutes() +
      ":" +
      current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
  
    console.log('request method: ', method);
    console.log('request url: ', url);
    console.log('request timestamp: ', formatted_date);
  
    next();
};

const validateActionId = async (req, res, next) => {
    try {
        const {id} = req.params;
        const action = await Actions.get(id);
        if (!action) {
            res.status(404).json({ message: `Action of id ${id} not found` })
        } else {
          req.action = action
          next()
        }
      }catch(error){
        res.status(404).json({message: `Action not found`})
      }
};

const validateProjectId = async (req, res, next) => {
    try {
        const {id} = req.params;
        const project = await Projects.get(id);
        if (!project) {
            res.status(404).json({ message: `Project of id ${id} not found` })
        } else {
          req.project = project
          next()
        }
      }catch(error){
        res.status(404).json({message: `Project not found`})
      }
};

function validateAction(req, res, next) {
    const body = req.body;
    if (!body || !body.project_id || !body.description || !body.notes ) {
        res.status(400).json({ message: `All action fields required.`})
    } else if (body.completed === null) {
        res.status(400).json({ message: `All action fields required.`})
    } else {
        next();
    }
};

function validateActionForUpdate(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: `All action fields required.`})
    } else {
        next();
    }
};

function validateProject(req, res, next) {
    if (!req.body || !req.body.name || !req.body.description) {
        res.status(400).json({message: 'All project fields required.'})
      } else if (req.body.description === null) {
        res.status(400).json({message: 'All project fields required.'})
      } else {
        next();
      }
};

function validateProjectForUpdate(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: `All project fields required.`})
    } else {
        next();
    }
};




  module.exports = {
    logger,
    validateActionId,
    validateProjectId,
    validateAction,
    validateActionForUpdate,
    validateProject,
    validateProjectForUpdate
  }