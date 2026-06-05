import handler from './[...route].ts';

export default function apiRoot(req: any, res: any) {
  req.query = { ...req.query, route: [] };
  return handler(req, res);
}
