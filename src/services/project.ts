import Project from '../models/project';
import Form from '../models/form';
import { IProjectDocument } from '../models/project/type';
import { throwDuplicate } from '../lib/error';
import formService from './form';
import { IFormDocument } from '../models/form/type';

class ProjectService {
  getStats = async (userId: string): Promise<Record<string, any>> => {
    try {
      const projects = await Project.find({ owner: userId });
      const inactiveProjects = projects.filter((project) => !project.active);
      const forms = await Form.find({ owner: userId });
      const inactiveForms = forms.filter((form) => !form.active);

      return {
        projects: { total: projects.length, inactive: inactiveProjects.length },
        forms: { total: forms.length, inactive: inactiveForms.length },
      };
    } catch (err) {
      throw new Error();
    }
  };

  createProject = async (
    data: Record<string, any>
  ): Promise<IProjectDocument> => {
    try {
      return await new Project(data).save();
    } catch (err) {
      throwDuplicate(err);
    }
  };

  getProject = async (id: string, user: any) => {
    const project = await Project.findOne({
      _id: id,
      $or: [
        { access: 'public' },
        { owner: user },
        { restrictedTo: { $in: [user] } },
      ],
    });

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
    const updatables = ['name', 'description', 'access', 'restrictedTo'];

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

  cloneProject = async (
    id: string,
    data: Record<string, any>
  ): Promise<IProjectDocument> => {
    try {
      const project = await new Project(data).save();

      const ownedForms = await Form.find({ project: id, active: true });

      for (let i = 0; i < ownedForms.length; i++) {
        const { name, description, fields, active } = ownedForms[i];

        await new Form({
          name,
          description,
          fields,
          active,
          project: project._id,
        }).save();
      }

      return project;
    } catch (err) {
      throwDuplicate(err);
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

  setProjectStatus = async (
    owner: string,
    id: string,
    active: boolean
  ): Promise<Record<string, any>> => {
    const project = await Project.findOne({ _id: id, owner });
    project['active'] = active;

    await project.save();

    return project;
  };
}

export default new ProjectService();
