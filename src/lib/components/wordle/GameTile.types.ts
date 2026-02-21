/**
 * GameTile Component Types
 * Type definitions for the GameTile component
 */

export interface GameTileProps {
	letter: string;
	state: 'empty' | 'filled' | 'correct' | 'present' | 'absent';
	position: number;
	animationDelay?: number;
	size?: 'small' | 'medium' | 'large';
}

export type TileState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';
export type TileSize = 'small' | 'medium' | 'large';
