import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Building,
  Mail,
  MapPin,
  User,
  CalendarDays,
  Globe,
  Heart,
  Users,
} from 'lucide-react'
import InfoItem from './InfoItem'
import { toast } from 'sonner'

import { getInitials } from '@/lib/utils/name'

type StudentAccount = {
  universityEmail: string
  studentNumber: string
  fullName: string
  isEnrolled: boolean
  sex: 'male' | 'female'
  address: string
  relationshipStatus: string | null
  birthday: string
  citizenship: string
  guardian: string | null
  courseCode: string | undefined
  courseName: string | undefined
  department: string | undefined
}

type AccountCardProps = {
  student: StudentAccount
}

const relationshipLabels: Record<string, string> = {
  single: 'Single',
  in_relationship: 'In a Relationship',
  married: 'Married',
}

const AccountCard = ({ student }: AccountCardProps) => {
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(student.universityEmail)
      toast.success('Email copied to clipboard')
    } catch {
      toast.error('Failed to copy email')
    }
  }

  return (
    <Card className="w-full max-w-2xl rounded-sm gap-1">
      <CardHeader className="px-6 py-5 flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt={getInitials(student.fullName)}
          />
          <AvatarFallback className="rounded-lg">
            {getInitials(student.fullName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <h1 className="font-bold text-xl leading-tight">
              {student.fullName}
            </h1>
            <Badge variant={student.isEnrolled ? 'default' : 'secondary'}>
              {student.isEnrolled ? 'Enrolled' : 'Not Enrolled'}
            </Badge>
          </div>
          <p className="text-sm">
            {student.courseName ?? 'No course'} · {student.studentNumber}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 divide-y divide-border sm:divide-y-0 border-b border-border mb-5">
          <div
            onClick={handleCopyEmail}
            className="sm:row-span-2 sm:border-r sm:border-border m-2 px-2 py-1.5 hover:cursor-pointer hover:bg-accent transition-colors duration-200"
          >
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Mail size={14} />
              Email
            </p>
            <p className="text-sm break-all">{student.universityEmail}</p>
          </div>

          <div className="sm:border-b sm:border-border px-4 py-3">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <MapPin size={14} />
              Address
            </p>
            <p className="text-sm line-clamp-2">{student.address}</p>
          </div>

          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Building size={14} />
              Department
            </p>
            <p className="text-sm">{student.department ?? 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <InfoItem label="Sex" value={student.sex} icon={User} />
          <InfoItem
            label="Birthday"
            value={student.birthday}
            icon={CalendarDays}
          />
          <InfoItem
            label="Citizenship"
            value={student.citizenship}
            icon={Globe}
          />
          <InfoItem
            label="Relationship Status"
            value={
              student.relationshipStatus
                ? relationshipLabels[student.relationshipStatus]
                : 'N/A'
            }
            icon={Heart}
          />
          <InfoItem
            label="Guardian"
            value={student.guardian ?? 'N/A'}
            icon={Users}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default AccountCard
