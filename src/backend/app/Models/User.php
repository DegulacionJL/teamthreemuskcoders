<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'name',
        'email',
        'password',
        'user_status_id',
        'avatar',
        'email_verified_at',
        'login_attempts',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Specify the guard to be used in role & permission
     *
     * @var string
     */
    public $guard_name = 'api';

    /**
     * Get the user's full name.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Retrieves all activation tokens of the user
     *
     * @return App\Models\ActivationToken[]
     */
    public function activationTokens()
    {
        return $this->hasMany(ActivationToken::class);
    }

    /**
     * Retrieves the Status of the User
     *
     * @return App\Models\UserStatus
     */
    public function status()
    {
        return $this->belongsTo(UserStatus::class, 'user_status_id');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id' , 'follower_id');
    }

    public function following()
    {
        return $this->belongsToMany(user::class, 'follows', 'follower_id', 'following_id');
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
    
    // /**
    //  * Get the users that are following this user.
    //  */
    // public function followers()
    // {
    //     return $this->hasMany(Follow::class, 'following_id');
    // }
    
    // /**
    //  * Get the users that this user is following.
    //  */
    // public function following()
    // {
    //     return $this->hasMany(Follow::class, 'follower_id');
    // }
}
