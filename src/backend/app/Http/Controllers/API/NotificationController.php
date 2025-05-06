<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Events\NotificationCreated;
use App\Http\Controllers\Controller;
use App\Services\API\NotificationService;
use App\Http\Requests\API\SearchNotificationRequest;

class NotificationController extends Controller
{
    /** @var App\Services\API\NotificationService */
    protected $notificationService;

    /**
     * NotificationController constructor.
     *
     * @param App\Services\API\NotificationService $notificationService
     */
    public function __construct(NotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;

        // enable api middleware
        $this->middleware(['auth:api']);
    }

    /**
     * List all notifications of current logged in user.
     *
     * @param App\Http\Requests\API\SearchNotificationRequest $request
     * @return \Illuminate\Http\Response
     */
    public function index(SearchNotificationRequest $request)
    {
        try {
            $conditions = [
                'keyword' => $request->getKeyword(),
                'page' => $request->getPage(),
                'limit' => $request->getLimit(),
                'order' => $request->getOrder(),
                'sort' => $request->getSort(),
                'recipient_id' => $request->getRecipientId(),
            ];

            $results = $this->notificationService->search($conditions);
            $this->response = array_merge($results, $this->response);
        } catch (Exception $e) { // @codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } // @codeCoverageIgnoreEnd

        return response()->json($this->response, $this->response['code']);
    }

    /**
     * Marks the notification as seen by the user.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function seen(Request $request)
    {
        try {
            $id = $request->route('id');
            $user = (int) $request->user()->id;
            $this->response['seen'] = $this->notificationService->seen($id, $user);
        } catch (Exception $e) {
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        }

        return response()->json($this->response, $this->response['code']);
    }

    /**
     * FOR DEMO PURPOSES ONLY.
     * Update/Remove this method on actual project implementation
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        try {
            $currentUser = $request->user();
            // get all users except the current user
            $users = User::whereNot('id', $currentUser->id)->get();
            $sampleScenarios = [
                ['type' => 'new_post', 'content' => 'added a new post'],
                ['type' => 'new_comment', 'content' => 'commented on a post'],
                ['type' => 'like_post', 'content' => 'liked your post'],
            ];
            // picking random scenario to send
            $scenario = $sampleScenarios[rand(0, 2)];
            // content to be shown in the notification list
            $content = "{$currentUser->full_name} {$scenario['content']}";

            foreach ($users as $user) {
                // insert notification in database
                $notification = Notification::create([
                    'content' => $content,
                    'recipient_id' => $user->id, // receiver
                    'sender_id' => $currentUser->id,
                    'type' => $scenario['type'],
                ]);
                // queue notification for broadcasting
                NotificationCreated::dispatch($notification);
            }
            $this->response['data'] = ['broadcasted' => true];
        } catch (Exception $e) { // @codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } // @codeCoverageIgnoreEnd

        return response()->json($this->response, $this->response['code']);
    }

    /**
     * Delete all notifications for the authenticated user.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function clearAll(Request $request)
    {
        $user = $request->user();
        \App\Models\Notification::where('recipient_id', $user->id)->delete();
        return response()->json(['success' => true]);
    }

}
