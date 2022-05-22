import { Request, Response, NextFunction } from 'express';
import service from '../services/project';

class ProjectController {
  createProject = async (
    { body, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, description } = body;
      const owner = currentUser._id;

      res.send(
        await service.createProject({
          name,
          description,
          owner,
        })
      );
    } catch (err) {
      next({ status: 400, reason: err.message });
    }
  };

  getProject = async (
    { params, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.send(await service.getProject(currentUser._id, params.projectId));
    } catch (err) {
      next({ status: 404 });
    }
  };

  getProjects = async (
    { currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.send(await service.getProjects(currentUser._id));
    } catch (err) {
      next({ status: 500 });
    }
  };

  updateProject = async (
    { params, body, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, description } = body;

      res.send(
        await service.updateProject(currentUser._id, params.projectId, {
          name,
          description,
        })
      );
    } catch (err) {
      next({
        status: err.code === 11000 ? 400 : 404,
        reason: err.message || undefined,
      });
    }
  };

  deleteProject = async (
    { params, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.send(await service.deleteProject(currentUser._id, params.projectId));
    } catch (err) {
      next({ status: 404 });
    }
  };
}

export default new ProjectController();
