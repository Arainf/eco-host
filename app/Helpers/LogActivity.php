<?php

namespace App\Helpers;

use App\Models\ActivityLog;

class LogActivity
{
    public static function add($action, $entity, $entityId, $changes = [])
    {
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'entity' => $entity,
            'entity_id' => $entityId,
            'changes' => $changes,
        ]);
    }
}
