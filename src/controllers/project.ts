import { Request, Response, NextFunction } from 'express';
import service from '../services/project';

class ProjectController {
  createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, description } = req.body;

      res.send(
        await service.createProject({
          name,
          description,
          owner: req.currentUser._id,
        })
      );
    } catch (err) {
      next({ status: 400, reason: err.message });
    }
  };

  getProject = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
    } catch (err) {}
  };

  getProjects = async (
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
    } catch (err) {}
  };

  updateProject = async (
    { params, body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
    } catch (err) {}
  };

  deleteProject = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
    } catch (err) {}
  };
}

export default new ProjectController();
