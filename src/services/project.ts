import Project from '../models/project';
import { IProjectDocument } from '../models/project/type';
import { throwDuplicate } from '../lib/error';
import formService from './form';
import { IFormDocument } from '../models/form/type';

class ProjectService {
  createProject = async (
    data: Record<string, any>
  ): Promise<IProjectDocument> => {
    try {
      return await new Project(data).save();
    } catch (err) {
      throwDuplicate(err);
    }
  };

  getProject = async (owner: string, id: string) => {
    const project = await Project.findOne({ _id: id, owner });

    if (!project) {
      throw new Error('invalid-project');
    }

    return project;
  };

  getProjects = async (owner: string): Promise<IProjectDocument[]> => {
    return await Project.find({ owner });
  };

  updateProject = async (
    owner: string,
    id: string,
    newData: Record<string, any>
  ): Promise<IProjectDocument> => {
    const updatables = ['name', 'description'];

    try {
      const project = await Project.findOne({ _id: id, owner });

      updatables.forEach((key) => {
        if (newData[key] != undefined) {
          project[key] = newData[key];
        }
      });

      return await project.save();
    } catch (err) {
      if (err.code === 11000) {
        throwDuplicate(err);
      } else {
        throw new Error();
      }
    }
  };

  deleteProject = async (
    owner: string,
    id: string
  ): Promise<IProjectDocument> => {
    const project = await Project.findOneAndDelete({ _id: id, owner });

    if (!project) {
      throw new Error();
    }

    const forms = await formService.deleteForms(project._id);

    forms.forEach(async (form: IFormDocument) => {
      await formService.deleteRecords(form._id);
    });

    return project;
  };
}

export default new ProjectService();
