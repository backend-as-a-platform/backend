import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import service from '../services/project';

class ProjectController {
  getStats = async (
    { currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.send(await service.getStats(currentUser._id));
    } catch (err) {
      next({ status: 500 });
    }
  };

  createProject = async (
    { body, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, description, access, restrictedTo } = body;
      const owner = currentUser._id;

      if (restrictedTo) {
        restrictedTo.forEach((id: string, i: number) => {
          restrictedTo[i] = Types.ObjectId(id);
        });
      }

      res.send(
        await service.createProject({
          name,
          description,
          access,
          restrictedTo,
          owner,
          active: true,
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
      res.send(await service.getProject(params.projectId, currentUser._id));
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
      const { name, description, access, restrictedTo } = body;

      res.send(
        await service.updateProject(currentUser._id, params.projectId, {
          name,
          description,
          access,
          restrictedTo,
        })
      );
    } catch (err) {
      next({
        status: err.code === 11000 ? 400 : 404,
        reason: err.message || undefined,
      });
    }
  };

  cloneProject = async (
    { params, body, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, description, access, restrictedTo } = body;

      res.send(
        await service.cloneProject(params.projectId, {
          name,
          description,
          access,
          restrictedTo,
          owner: currentUser._id,
          active: true,
        })
      );
    } catch (err) {
      next({ status: err.code, reason: err.message });
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

  setProjectStatus = async (
    { params, currentUser, body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.send(
        await service.setProjectStatus(
          currentUser._id,
          params.projectId,
          body.active
        )
      );
    } catch (err) {
      next({ status: 404 });
    }
  };
}

export default new ProjectController();
