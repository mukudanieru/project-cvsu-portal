import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

type PasswordInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <InputGroup>
        <InputGroupInput
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            variant="secondary"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
