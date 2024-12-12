import { DataObject } from '../types/DataTypes';
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Badge } from "@nextui-org/badge";
import { CheckCircle, XCircle } from 'lucide-react';

export default function DataCards({ data }: { data: DataObject }) {
  return (
    <div className="max-w">
      {Object.values(data).map((project: DataObject, index) => (
        <Card key={index} className="max-w bg-black m-12 b-12 max-w">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md p-3 text-3xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">{project.proj_name}</p>
            </div>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <div>Multi Factor Authentication</div>
              </h3>
              {Object.entries(project.mfa_user_check).map(([id, status]) => (
                <div key={id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{project.id_to_email_map[id]}</span>
                  {status ? 
                    <CheckCircle className="text-green-500 h-5 w-5" /> : 
                    <XCircle className="text-red-500 h-5 w-5" />
                  }
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <div>Row Level Security</div>
              </h3>
              {Object.entries(project.table_rls_check).map(([table, status]) => (
                <div key={table} className="flex items-center justify-between text-sm">
                  <span>{table}</span>
                  {status ? 
                    <CheckCircle className="text-green-500 h-5 w-5" /> : 
                    <XCircle className="text-red-500 h-5 w-5" />
                  }
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <div>Point In Time Recovery</div>
              </h3>
              <div className="flex items-center justify-between text-sm">
                <span>{project.pitr_check ? 'Enabled' : 'Disabled'}</span>
                {project.pitr_check ? 
                  <CheckCircle className="text-green-500 h-5 w-5" /> : 
                  <XCircle className="text-red-500 h-5 w-5" />
                }
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

