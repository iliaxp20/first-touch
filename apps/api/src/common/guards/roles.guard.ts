import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('شما مجوز دسترسی به این بخش را ندارید.');
    }

    // Role hierarchy / equivalence: ADMIN has access to all; PLAYER equals STUDENT
    if (user.role === Role.ADMIN) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => {
      if (role === user.role) return true;
      if (role === Role.STUDENT && user.role === Role.PLAYER) return true;
      if (role === Role.PLAYER && user.role === Role.STUDENT) return true;
      return false;
    });

    if (!hasRole) {
      throw new ForbiddenException('دسترسی غیرمجاز: سطح دسترسی حساب شما کافی نیست.');
    }

    return true;
  }
}
