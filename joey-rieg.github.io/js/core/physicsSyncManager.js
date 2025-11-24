import * as THREE from 'three';
import * as CANNON from "cannon-es";

const syncObjects = []

export function registerSyncObject(mesh, body)
{
    syncObjects.push({mesh, body});
}

export function updatePhysicSync()
{
    for (const syncItem of syncObjects) {
        if (syncItem.body.mass === 0 && syncItem.body.sleepState === CANNON.Body.SLEEPING)
            continue;
        
        syncItem.mesh.position.copy(syncItem.body.position);
        syncItem.mesh.quaternion.copy(syncItem.body.quaternion);
    }
}